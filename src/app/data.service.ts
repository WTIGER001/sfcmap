import { Injectable } from "@angular/core";
import { AngularFireStorage } from "angularfire2/storage";
import { NotifyService, Debugger } from "./notify.service";
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { MapType, MapConfig, MarkerCategory, MarkerType, MapPrefs, Prefs, UserAssumedAccess, MergedMapType, Category, ObjectType, MarkerGroup, Annotation, MarkerTypeAnnotation, ImageAnnotation, ItemAction, User, Online, Game, GameSystem, Restricition, TokenAnnotation } from "./models";
import { ReplaySubject, BehaviorSubject, Subject, Observable, of, Subscription, combineLatest, forkJoin, concat, from } from "rxjs";
import { mergeMap, map, tap, first, concatMap, take, distinct, filter } from "rxjs/operators";
import { DbConfig } from "./models/database-config";
import { LangUtil } from "./util/LangUtil";
import { UUID } from "angular2-uuid";
import { isArray } from "util";
import { IUndoableAction } from "./commands/IUndoableAction";
import { Character } from "./models/character";
import { CharacterType } from "./models/character-type";
import { Encounter } from "./encounter/model/encounter";
import { User as FireUser } from "firebase";
import { ImageSearchResult } from "./util/GoogleImageSearch";
import { Pathfinder } from "./models/gamesystems/pathfinder";
import { DataAssetArray, DataAsset } from "./data-asset";
import { Item } from "./items/item";
import { Monster } from "./monsters/monster";
import { Token } from "./maps/token";
import { ShareEvent } from "./models/system-models";
import { CacheService } from "./cache/cache.service";
import { CachedItem } from "./cache/cache";
import { FogOfWar } from "./maps/fow";
import { Fog } from "three";
import { MonsterToCharacter } from "./monsters/to-character";

export class GameAssets {
  annotationFolders = new DataAssetArray<MarkerGroup>(MarkerGroup.TYPE)
  // annotations = new DataAsset<Annotation>(Annotation.TYPE)
  characterTypes = new DataAssetArray<CharacterType>(CharacterType.TYPE)
  characters = new DataAssetArray<Character>(Character.TYPE)
  encounters = new DataAssetArray<Encounter>(Encounter.TYPE)
  maps = new DataAssetArray<MapConfig>(MapConfig.TYPE)
  mapTypes = new DataAssetArray<MapType>(MapType.TYPE)
  markerCategories = new DataAssetArray<MarkerCategory>(MarkerCategory.TYPE)
  markerTypes = new DataAssetArray<MarkerType>(MarkerType.TYPE)
  // monsters = new DataAsset<Monster>(Monster.TYPE)
  items = new DataAssetArray<Item>(Item.TYPE)
  tokens = new DataAssetArray<Token>(Token.TYPE)
  shareEvents = new Subject<ShareEvent>()

  subscribeAll(game$: Observable<Game>, notify: NotifyService, data: DataService) {
    this.annotationFolders.subscribe(game$, notify, data)
    // this.annotations.subscribe(game$, notify, data)
    this.characterTypes.subscribe(game$, notify, data)
    this.characters.subscribe(game$, notify, data)
    this.encounters.subscribe(game$, notify, data)
    this.maps.subscribe(game$, notify, data)
    this.mapTypes.subscribe(game$, notify, data)
    this.markerCategories.subscribe(game$, notify, data)
    this.markerTypes.subscribe(game$, notify, data)
    // this.monsters.subscribe(game$, notify, data)
    this.items.subscribe(game$, notify, data)
    this.tokens.subscribe(game$, notify, data)


    game$.pipe(
      filter(game => game !== undefined),
      mergeMap(game => data.sharedEvents$(game.id)),
      tap(event => this.shareEvents.next(event))
    ).subscribe()


  }
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  /**
   * Static id computed on each load to identify the browser tab for events. No need for this to be the same between instances
   */
  public static readonly BrowserId = UUID.UUID().toString()

  /**
   * The nobody user
   */
  public static readonly NOBODY = new User()

  /**
   * Name for the groups of items that are not part of any group
   */
  public static readonly UNCATEGORIZED = "UNGROUPED"

  /**
   * The logger that is used for items relating to data loading
   */
  private log: Debugger

  // User Level Observables
  user = new BehaviorSubject<User>(DataService.NOBODY)
  userPrefs = new BehaviorSubject<Prefs>(new Prefs())
  userMapPrefs = new BehaviorSubject<MapPrefs>(new MapPrefs())
  userAccess = new BehaviorSubject<UserAssumedAccess>(new UserAssumedAccess())
  online = new ReplaySubject<Array<Online>>(1)

  // System Level Observables
  users = new BehaviorSubject<Array<User>>([])
  gamesystems = new BehaviorSubject<Array<GameSystem>>([])
  games = new ReplaySubject<Array<Game>>(1)

  // Game Level Observablaes
  game = new BehaviorSubject<Game>(undefined)
  gameAssets = new GameAssets()

  mapTypesWithMaps = new ReplaySubject<Array<MergedMapType>>(1)
  categories = new ReplaySubject<Array<Category>>(1)


  monstersLoading = new BehaviorSubject<boolean>(true)
  charactersLoading = new BehaviorSubject<boolean>(true)

  mapsCurrent: MapConfig[] = []

  ready = new BehaviorSubject<boolean>(false)
  saves = new Subject<any>()

  markerTypeChanges$ = new ReplaySubject<ItemAction<MarkerType>>()
  // markerTypesAll = new BehaviorSubject<Array<MarkerType>>([])

  subs: Subscription[] = []

  pathfinder: Pathfinder
  pretendToBePlayer = false;

  // User & Assumed Groups ->  Map Configs
  constructor(private afAuth: AngularFireAuth, private notify: NotifyService, private storage: AngularFireStorage, public db: AngularFireDatabase, private cache: CacheService) {
    this.log = this.notify.newDebugger("Data")

    this.setUpSubscriptions()
    this.loadGamesystems()
  }

  setUpSubscriptions() {
    this.subscribeToUserLogon()
    this.loadUserExtensions()
    this.loadDataFromUser()
    this.loadGameAssets()
    // this.loadMergedMapTypes()
    this.loadCategories()
  }

  /**
   * Subscribe to the user logon event from firebase and load / create the real user as necessary
   */
  subscribeToUserLogon() {
    // Subscribe to the firebase user. This can be null or a firebase user. When we get a user or a null value we reload all the data
    this.afAuth.user.pipe(
      tap(fireUser => this.log.info("User Logged In: ", fireUser.displayName)),
      tap(fireUser => this.trackPresence(fireUser)),
      map(fireUser => User.fromFireUser(fireUser)),
      tap(user => this.record('user', 1)),
      mergeMap(user => this.getUserInfo(user)),
      tap(user => this.record('user-info', 1)),
    ).subscribe(u => {
      this.log.info("User Completely logged in: ", u.name)
      this.user.next(u)
    })

    this.user.subscribe(u => tap(u => this.log.info("User confirmed : ", u)))
  }

  // User -> UserAccess, MapPrefs, Prefs
  loadUserExtensions() {
    // Map Prefs
    this.user.pipe(
      tap(u => this.log.info("User triggered : ", u)),
      mergeMap(u => this.getOrCreate(u.id, new MapPrefs())),
      tap(p => this.log.info("Map Prefs Loaded: ", p)),
      tap(p => this.record('user-map-prefs', 1)),
    ).subscribe(p => this.userMapPrefs.next(MapPrefs.to(p)))

    // Prefs
    this.user.pipe(
      mergeMap(u => this.getOrCreate(u.id, new Prefs())),
      tap(p => this.log.info("Prefs Loaded: ", p)),
      tap(p => this.record('user-prefs', 1)),
    ).subscribe(p => this.userPrefs.next(Prefs.to(p)))

    // Access
    this.user.pipe(
      mergeMap(u => this.getOrCreate(u.id, new UserAssumedAccess)),
      tap(p => this.log.info("User Access Loaded: ", p)),
      tap(p => this.record('user-access', 1)),
    ).subscribe(p => this.userAccess.next(UserAssumedAccess.to(p)))
  }

  loadGamesystems() {
    const pathfinder = new Pathfinder()
    pathfinder.load(this.cache)
    this.user.subscribe(u => {
      if (u.id != "NOBODY") {
        pathfinder.subscribeToUpdates(this.db, this.cache)
      }
    })

    this.pathfinder = pathfinder

    const gs = []
    gs.push(pathfinder)

    this.gamesystems.next(gs)
  }

  // User -> Map Types, Marker Types, Marker Categories, User Groups, Users
  loadDataFromUser() {
    this.loadUsers()
    this.loadAndNotify<Game>(this.games, 'games', 'Loading Games')

  }

  private getAll<T>(folder: string): Observable<T[]> {
    return this.db.list<T>(folder).valueChanges()
  }

  loadUsers() {
    let sub = this.user.pipe(
      tap(user => this.users.value.splice(0)),
      mergeMap(user => user.id === 'NOBODY' ? of({}) : this.db.list<User>('users').stateChanges())
    ).subscribe(
      item => {
        if (isArray(item)) {
          return
        }
        try {
          let i = <AngularFireAction<DatabaseSnapshot<User>>>item
          let u = User.to(i.payload.val())

          if (i.type == 'child_added') {
            this.users.value.push(u)
          } else if (i.type == 'child_removed') {
            const idx = this.users.value.findIndex(me => me.id == u.id)
            if (idx >= 0) {
              this.users.value.splice(idx, 1)
            }
          }
        } catch (err) {
          this.log.error("Error Loading ", name, err)
        }
      }
    )
    this.subs.push(sub)
  }

  loadGameAssets() {
    this.gameAssets.subscribeAll(this.game, this.notify, this)
  }

  // // Maps
  // loadMaps() {
  //   this.userAccess.pipe(
  //     mergeMap(ua => ua.id === 'NOBODY' ? of([]) : this.db.list(MapConfig.FOLDER).valueChanges()),
  //     tap(maps => { this.mapsCurrent.splice(0), this.mapsCurrent.push(...maps) })
  //   ).subscribe(maps => this.receiveArray(maps, this.maps))
  // }

  // Merged 
  loadMergedMapTypes() {
    combineLatest(this.gameAssets.maps.items$, this.gameAssets.mapTypes.items$).subscribe(
      (value) => {
        const maps = value[0]
        const types = value[1]
        let mergedArr = new Array<MergedMapType>()
        types.forEach(mt => {
          let merged = new MergedMapType()
          merged.name = mt.name
          merged.order = mt.order
          merged.id = mt.id
          merged.defaultMarker = mt.defaultMarker
          merged.maps = maps.filter(m => m.mapType == merged.id && this.canView(m))
          mergedArr.push(merged)
        })

        let items = mergedArr.sort((a, b) => a.order - b.order)
        this.mapTypesWithMaps.next(items)
        this.log.debug(`Loaded Map Types With Maps ... ${items.length}`)
        this.ready.next(true)
      }
    )
  }

  loadCategories() {
    combineLatest(this.gameAssets.markerCategories.items$, this.gameAssets.markerTypes.items$).subscribe(
      (value) => {
        let cats = value[0]
        let types = value[1]
        let mycats = new Array<Category>()
        cats.forEach(cat => {
          // Load the Category
          let c = new Category()
          c.id = cat.id
          c.name = cat.name
          c.appliesTo = cat.appliesTo
          mycats.push(c)

          // Add the correct marker types
          c.types = types.filter(t => t.category == c.id) || []
        })
        this.categories.next(mycats)
      }
    )
  }


  /**
   * Take an array that was recieved from Firebase and notify everyone
   */
  private receiveArray<T>(arr: T[], subject: Subject<T[]>, sorter?: (items: Array<T>) => void) {
    let items: T[] = []
    arr.forEach(m => {
      if (this.canView(m)) {
        items.push(DbConfig.toItem(m))
      }
    })
    if (sorter) {
      sorter(items)
    }
    subject.next(items)
  }

  /**
   * Get the Users information or create it if needed
   * @param u user to load
   */
  private getUserInfo(u: User): Observable<User> {
    this.log.debug("Getting User Information for " + u.id);
    if (u == null || u.id == 'NOBODY') {
      return of(new User())
    }
    let path = DbConfig.dbPath(u)
    return this.db.object(path)
      .snapshotChanges()
      .pipe(
        mergeMap(result => {
          if (result.payload.exists()) {
            let u = User.to(result.payload.val())
            this.log.debug("User Exists: ", u);
            return of(u)
          } else {
            this.log.debug("User doesn't exist");
            this.save(u)
            return of(u)
          }
        })
      )
  }

  private getOrCreate<T extends ObjectType>(uid: string, obj: T): Observable<T> {
    const name = obj['objType']
    this.log.debug("Getting User Information for " + name);
    obj['id'] = uid
    if (uid == 'NOBODY') {
      return of(obj)
    }
    let path = DbConfig.dbPath(obj)
    return this.db.object(path)
      .snapshotChanges()
      .pipe(
        mergeMap(result => {
          if (result.payload.exists()) {
            let item = <T>DbConfig.toItem(result.payload.val())
            this.log.debug(name, " Exists: ", item);
            return of(item)
          } else {
            this.log.debug(name, " doesn't exist");
            this.save(obj)
            return of(obj)
          }
        })
      )
  }


  private loadAndNotify<T>(subject: Subject<Array<T>>, name: string, errorType: string, current?: Array<T>, loading?: BehaviorSubject<boolean>) {
    this.log.debug('Base Item loadAndNotify ' + name)

    let sub = this.user.pipe(
      mergeMap(user => user.id === 'NOBODY' ? of([]) : this.db.list<T>(name).valueChanges())
    ).subscribe(
      inTypes => {
        this.log.debug('loadAndNotify ' + name)
        let items = new Array<T>()
        inTypes.forEach(item => {
          try {
            // Convert the item to a real object with methods and all
            // If something is setup incorrectly then there can be an error
            items.push(DbConfig.toItem(item))
          } catch (err) {
            this.log.error("Error Loading ", name, err)
          }
        })
        this.log.debug("Loaded " + items.length + " " + name);
        this.record(name, items.length)

        if (current) {
          current.splice(0)
          current.push(...items)
        }
        if (loading) { loading.next(false) }
        subject.next(items)
      },
      error => {
        this.notify.showError(error, errorType)
      }
    )
    this.subs.push(sub)
  }

  getAnnotations$(mapId: string): Observable<ItemAction<Annotation>> {
    return this.game.pipe(
      filter(game => game !== undefined ),
      map(game => DbConfig.pathFolderTo(Annotation.TYPE, game.id)),
      mergeMap(path => this.db.list(path, ref => ref.orderByChild('map').equalTo(mapId)).stateChanges()),
      map(item => new ItemAction(item.type, DbConfig.toItem(item.payload.val()))),
      tap(p => this.record('annotation', 1)),
      filter(item => this.canView(item.item))
    )
  }

  getAnnotationGroups$(mapId: string): Observable<ItemAction<MarkerGroup>> {
    return this.game.pipe(
      map(game => DbConfig.pathFolderTo(MarkerGroup.TYPE, game.id)),
      mergeMap(path => this.db.list(path, ref => ref.orderByChild('map').equalTo(mapId)).stateChanges()),
      map(item => new ItemAction(item.type, DbConfig.toItem(item.payload.val()))),
      tap(p => this.record('annotation-group', 1)),
    )
  }

  private getMarkerGroups(mapid: string): Observable<Array<MarkerGroup>> {
    return this.gameAssets.annotationFolders.items$.pipe(
      map(items => items.filter(i => i.map == mapid))
    )
  }

  /**
   * Checks if an item is restricted from viewing
   * @param obj Item to Check
   */
  isRestricted(obj: any): boolean {
    return obj.restriction > 0
  }

  isPlayer(user?: User) {
    if (!user) {
      user = this.user.value
    }
    if (this.game.value) {
      return this.game.value.players.includes(user.id)
    }
    return false
  }

  isGM(user?: User) {
    if (!user) {
      user = this.user.value
    }
    if (this.pretendToBePlayer) {
      return false
    }
    return this.isRealGM(user)
  }

  isRealGM(user?: User) {
    if (!user) {
      user = this.user.value
    }
    if (this.game.value && this.game.value.gms && this.game.value.gms.length > 0) {
      return this.game.value.gms.includes(user.id)
    }
    if (this.game.value) {
      // NO GMS so..
      return true
    }
    return false
  }

  /**
    * Determines if the current user can view an item.
    * @param item The item to check
    */
  canView(item: any): any {
    if (!item['restriction']) {
      return true
    }
    if (this.isGM()) {
      return true;
    }
    if (this.isPlayer) {
      if (item.restriction == Restricition.PlayerReadWrite || item.restriction == Restricition.PlayerRead) {
        return true
      }
    }
    return false
  }

  /**
   * Determines if the current user can edit an item.
   * @param item The item to check
   */
  canEdit(item: any): any {
    if (!item['restriction']) {
      return true
    }
    if (this.isGM()) {
      return true;
    }
    if (this.isPlayer) {
      if (item.restriction == Restricition.PlayerReadWrite) {
        return true
      }
    }
    return false
  }

  canEditField(item: any, field: string): any {
    if (!item.restrictedContent) {
      return true
    }
    if (this.isGM()) {
      return true;
    }
    if (this.isPlayer) {
      if (item.restrictedContent[field]) {
        if (item.restrictedContent[field] == Restricition.PlayerReadWrite) {
          return true
        }
      } else {
        return true;
      }
    }
    return false
  }

  canViewField(item: any, field: string): any {
    if (!item.restrictedContent) {
      return true
    }
    if (this.isGM()) {
      return true;
    }
    if (this.isPlayer) {
      if (item.restrictedContent[field]) {
        if (item.restrictedContent[field] == Restricition.PlayerReadWrite || item.restrictedContent[field] == Restricition.PlayerRead) {
          return true
        }
      } else {
        return true;
      }
    }
    return false
  }

  isReal(): any {
    return this.user.getValue().id != "NOBODY"
  }

  isLinked(item: any, idToCheck?: string) {
    if (!idToCheck && this.game.value) {
      idToCheck = this.game.value.id
    }
    if (!idToCheck) {
      return false
    }
    return item.owner ? idToCheck != item.owner : false
  }

  save(item: ObjectType, path?: string) {
    // Copy the Item so we only save a normal javascript object, and remove all the bad
    // let toSave = LangUtil.clean(Object.assign({}, item))
    // Remove the fields that are not part of the object that should be saved in the database
    // LangUtil.trimExtraneousFields(toSave, this.sample(item))
    this.assignId(item)
    const toSave = LangUtil.prepareForStorage(item)

    // Get path to the object (if not already supplied)
    if (!path) {
      path = DbConfig.dbPath(item)
    }
    console.log('Saving Item ', toSave, path)

    this.db.object(path).set(toSave).then(() => {
      // this.notify.success("Saved " + path)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving " + path)
    })
    this.saves.next(item)
  }

  save$(item: any, path: string) {
    console.log('Saving Item (pre) ', item, path)
    const toSave = LangUtil.prepareForStorage(item)
    console.log('Saving Item ', toSave, path)
    return from(this.db.object(path).set(toSave))
  }

  saveToken(t: Token, image?: Blob) {
    console.log('Saving Map ', map.name)

    if (image) {
      let pathImage = 'tokens/' + t.id
      console.log("Preparing to save Map DATA", t);

      forkJoin(this.saveImage(image, pathImage)).pipe(
        mergeMap(result => this.fillInTokenImage(t)),
      ).subscribe(() => {
        this.setImageMetadata(pathImage)
        console.log("Saving Map DATA", t);
        this.save(t)
      }, err => {
        this.log.debug("ERROR");
        this.log.debug(err);
      }, () => {
        this.log.debug("Complete");
      })

    } else {
      console.log("No Images", t);
      this.save(t)
    }
  }

  saveMap(map: MapConfig, image?: Blob, thumb?: Blob) {
    console.log('Saving Map ', map.name)

    if (thumb && image) {
      let pathImage = 'images/' + map.id
      let pathThumb = 'images/' + map.id + "_thumb"
      console.log("Preparing to save Map DATA", map);

      forkJoin(this.saveImage(image, pathImage), this.saveImage(thumb, pathThumb)).pipe(
        mergeMap(result => this.fillInMapUrl(map)),
        mergeMap(result => this.fillInMapThumb(map))
      ).subscribe(() => {
        this.setImageMetadata(pathImage)
        this.setImageMetadata(pathThumb)
        console.log("Saving Map DATA", map);
        this.save(map)
      }, err => {
        this.log.debug("ERROR");
        this.log.debug(err);
      }, () => {
        this.log.debug("Complete");
      })

    } else {
      console.log("No Images", map);
      this.save(map)
    }
  }

  saveImageAnnotation(item: ImageAnnotation) {
    this.log.debug('Saving Image Annotation ', map.name)

    this.assignId(item)
    const data = item._blob
    let pathImage = 'images/' + item.id
    forkJoin(this.saveImage(data, pathImage)).pipe(
      mergeMap(result => this.fillInImageAnnotationUrl(item)),
    ).subscribe(() => {
      console.log(" DATA", item);
      this.setImageMetadata(pathImage)
      this.save(item)
    }, err => {
      this.log.debug("ERROR");
      this.log.debug(err);
    }, () => {
      this.log.debug("Complete");
    })
  }


  saveMakerType(item: MarkerType, image?: Blob, thumb?: Blob) {
    console.log('Saving Marker ', item.name)

    if (item['__FILE']) {
      let pathImage = 'images/' + item.owner + "/" + item.id
      console.log("Preparing to save Marker DATA", map);

      forkJoin(this.saveImage(item['__FILE'], pathImage)).pipe(
        mergeMap(result => this.fillInMyUrl(item, pathImage, 'url'))
      ).subscribe(() => {
        this.setImageMetadata(pathImage)
        console.log("Saving marker DATA", map);
        this.save(item)
      }, err => {
        this.log.debug("ERROR");
        this.log.debug(err);
      }, () => {
        this.log.debug("Complete");
      })

    } else {
      console.log("No Images", map);
      this.save(item)
    }
  }

  setImageMetadata(path: string) {
    const ref = this.storage.ref(path)
    ref.updateMetatdata({ cacheControl: "max-age=31536000" }).subscribe()
  }

  saveImage(data: Blob, path: string) {
    console.log("Saving Map Blob " + path);

    const ref = this.storage.ref(path)
    let loadProgress = new Subject<number>()

    const task = ref.put(data)
    task.percentageChanges()
      .subscribe(loadProgress)

    loadProgress.subscribe(this.notify.progress("Loading Image"))
    loadProgress.subscribe(ignore => { }, error => { }, () => {
      this.setImageMetadata(path)
    })

    return loadProgress
  }

  uploadFile(path: string, f: File): Observable<number> {
    const ref = this.storage.ref(path)
    let loadProgress = new Subject<number>()
    loadProgress.subscribe(this.notify.progress("Loading File"))

    const task = ref.put(f)
    task.percentageChanges()
      .subscribe(loadProgress)

    return loadProgress
  }

  saveAll(...items) {
    items.forEach(i => this.save(i))
  }

  url(item: MapConfig | MarkerType): Observable<string> {

    let path = 'images/' + item.id
    // console.log(`Map URL for ${item.id}-${item.name} is ${path}`);

    const ref = this.storage.ref(path);
    return ref.getDownloadURL().pipe(
      map(item => {
        return item
      })
    )
  }

  pathToUrl(path: string): Observable<string> {
    const ref = this.storage.ref(path);
    return ref.getDownloadURL()
  }

  setUrl(path: string, ir: ImageSearchResult, isThumb?: boolean): Observable<ImageSearchResult> {
    const ref = this.storage.ref(path);
    return ref.getDownloadURL().pipe(
      map(url => {
        isThumb ? ir.thumb = url : ir.url = url
        return ir
      })
    )
  }

  fillInTokenImage(item: Token): Observable<Token> {
    let path = 'tokens/' + item.id
    const ref = this.storage.ref(path);
    return ref.getDownloadURL().pipe(
      map(url => {
        item.image = url
        return item
      })
    )
  }

  fillInUrl(item: MarkerType): Observable<MarkerType> {
    let path = 'images/' + item.id
    // console.log(`Marker Type URL for ${item.id}-${item.name} is ${path}`);

    const ref = this.storage.ref(path);
    return ref.getDownloadURL().pipe(
      map(url => {
        // console.log(`Marker Type URL for ${item.id}-${item.name} ULR IS ${url}`);

        item.url = url
        return item
      })
    )
  }

  fillInImageAnnotationUrl(item: ImageAnnotation): Observable<ImageAnnotation> {
    let path = 'images/' + item.id
    const ref = this.storage.ref(path);
    return ref.getDownloadURL().pipe(
      map(url => {
        item.url = url
        return item
      })
    )
  }

  fillInImageUrl(item: any): Observable<any> {
    let path = 'images/' + item.id
    const ref = this.storage.ref(path);
    return ref.getDownloadURL().pipe(
      map(url => { item.url = url; return item })
    )
  }

  fillInMapUrl(item: MapConfig): Observable<MapConfig> {
    let path = 'images/' + item.id
    console.log(`Fill In Map URL for ${item.id}-${item.name} is ${path}`);
    const ref = this.storage.ref(path);
    return ref.getDownloadURL().pipe(
      map(url => {
        console.log(`Fill In Map URL for ${item.id}-${item.name} URL ${url} for map `, item);

        item.image = url
        return item
      })
    )
  }

  fillInMapThumb(item: MapConfig): Observable<MapConfig> {
    return this.thumb(item).pipe(
      map(url => {
        console.log("Thumbnail Complete: ", url, " for ", item.id + " (" + item.name + ") for ", item);
        item.thumb = url
        return item
      })
    )
  }

  fillInMyUrl(item: any, path: string, urlField: string): Observable<any> {
    const ref = this.storage.ref(path);
    return ref.getDownloadURL().pipe(
      tap(url => console.log('Got URL ' + url)),
      tap(url => item.url = url),
      map(url => item),
      tap(i => console.log('donw with item', item)),
      first()
    )
  }

  thumb(mapCfg: MapConfig): Observable<string> {
    let path = 'images/' + mapCfg.id + "_thumb"
    console.log(`Thumbnail for ${mapCfg.id}-${mapCfg.name} is ${path}`);
    const ref = this.storage.ref(path);
    return ref.getDownloadURL()
  }

  updateAllMapUrls() {
    // Load all the maps
    this.db.list<MapConfig>(MapConfig.FOLDER).valueChanges().pipe(first()).subscribe(items => {
      items.forEach(map => {
        this.updateMapUrls(map)
      })
    })

    this.db.list<MarkerType>(MarkerType.FOLDER).valueChanges().pipe(first()).subscribe(items => {
      items.forEach(markerType => {
        this.updateMarkerUrls(markerType)
      })
    })
  }

  updateMarkerUrls(markerType: MarkerType) {
    let m = MarkerType.to(markerType)
    this.fillInUrl(m).subscribe(() => {
      console.log("Updating markerType DATA ");
      this.save(m)
    }, err => {
      this.log.debug("ERROR: ", err);
    }, () => {
      this.log.debug("Complete");
      this.notify.success("Updated urls for: " + m.name);
    })
  }

  updateMapUrls(mapCfg: MapConfig) {
    let map = MapConfig.to(mapCfg)
    concat(
      this.fillInMapUrl(map),
      this.fillInMapThumb(map)
    ).subscribe(() => {
      console.log("Updating Map DATA ");
      this.save(map)
    }, err => {
      this.log.debug("ERROR: ", err);
    }, () => {
      this.log.debug("Complete");
      this.notify.success("Updated urls for: " + map.name);
    })
  }

  unlink(item: any): any {
    const type = item.objType
    const key = DbConfig.key(type)
    if (key) {
      this.gameAssets[key].excludeIds.push(item.id)
      this.gameAssets.characters.refilter()
    }
  }

  delete(item: ObjectType) {
    console.log("Deleteing ", item);

    if (MapConfig.is(item)) {
      this.deleteImages(item)
    }
    console.log("Deleteing 2");

    let path = DbConfig.dbPath(item)

    // let path = this.dbPath(item)
    console.log("Deleteing Path ", item, ' ', path);

    this.db.object(path).remove().then(() => {
      this.notify.success("Removed ")
    }).catch(reason => {
      this.notify.showError(reason, "Error Deleting " + path)
    })
  }

  private deleteImages(item: MapConfig) {
    this.storage.ref('images/' + item.id).delete()
    this.storage.ref('images/' + item.id + "_thumb").delete()
  }

  deleteMap(item: MapConfig) {
    this.delete(item)
    this.storage.ref('images/' + item.id).delete()
    this.storage.ref('images/' + item.id + "_thumb").delete()
  }

  assignId(item: any) {
    if (!item.id) {
      item.id = this.db.createPushId()
    } else if (item.id == 'TEMP') {
      item.id = this.db.createPushId()
    }
  }

  clearChat() {
    this.db.object("chat").remove().then(() => {
      this.notify.success("Cleared Chat ")
    }).catch(reason => {
      this.notify.showError(reason, "Error Deleting Chat")
    })
  }

  deleteAll(...items) {
    items.forEach(i => this.delete(i))
  }


  public saveRecentMarker(markerId: string) {
    // if (this.isReal()) {
    //   let u = this.user.getValue()
    //   if (u.recentMarkers) {
    //     u.recentMarkers.unshift(markerId)
    //     if (u.recentMarkers.length > 5) {
    //       u.recentMarkers.splice(5, u.recentMarkers.length - 5)
    //     }
    //   } else {
    //     u.recentMarkers = [markerId]
    //   }
    //   this.save(u)
    // }
  }

  public saveRecentMap(mapId: string) {
    this.log.debug("Saving Recent Map");

    if (this.isReal()) {
      let u = this.userPrefs.getValue()
      // let u = this.user.getValue()
      this.log.debug("Found User Prefs");

      if (u.recentMaps) {
        let recent = u.recentMaps.filter(item => item != mapId)
        recent.unshift(mapId)
        if (recent.length > 4) {
          recent.splice(4, recent.length - 4)
        }
        u.recentMaps = recent
      } else {
        u.recentMaps = [mapId]
      }
      this.log.debug("Saving");
      this.save(u)
    }
  }


  private remove(arr: string[], val: string): boolean {
    if (arr) {
      let indx = arr.indexOf(val)
      if (indx >= 0) {
        arr.splice(indx)
        return true
      }
    }
    return false
  }

  trackPresence(u: FireUser) {
    const online: Online = {
      login: new Date().toString(),
      id: u.uid,
      image: u.photoURL,
      name: u.displayName
    }
    const path = 'online/' + u.uid
    this.db.object(path).set(online)
    this.db.database.ref(path).onDisconnect().remove();

    this.db.list<Online>('online').valueChanges().subscribe(a => this.online.next(a))
  }





  /**
   * Loads and sets the current game. 
   * 
   * @param id Game ID to load
   */
  public setCurrentGame(id: string) {
    console.log("SETCurrentGame", id, DbConfig.pathTo(Game.TYPE, undefined, id));

    if (this.game.value == undefined || this.game.value.id != id) {
      const path = DbConfig.pathTo(Game.TYPE, undefined, id)
      const doc = this.db.object<Game>(path)
      doc.valueChanges().subscribe(g => this.game.next(g))
    }
  }

  // CHANGE TO FIRESTORE
  find(path: string, field: string, value: string): Observable<any[]> {
    return this.db.list(path).valueChanges().pipe(
      map(items => items.filter(item => item[field] == value)),
      take(1)
    )
  }

  choices(path: string, field: string): Observable<any[]> {
    // path = "monster-index"

    console.log("Getting choices ", path, field);
    return this.db.list(path).valueChanges().pipe(
      tap(items => console.log("Found Items", items.length)),
      take(1),
      tap(items => console.log("Found Items2", items.length)),
      map(items => {
        const vals = new Map<string, boolean>()
        items.forEach(i => vals.set(i[field], true))
        const out = []
        vals.forEach((v, k) => {
          out.push(k)
        })
        return out
      }),
      tap(items => console.log("SENDING Items", items.length))

    )
  }

  displayName(id: string): string {
    const u = this.users.value.find(u => u.id == id)
    if (u) {
      return u.displayName ? u.displayName : u.name
    }
    return "Unknown User (" + id + ")"
  }

  // ----------------------------------------------------------------------------------------------
  // Display Sharing 
  // ----------------------------------------------------------------------------------------------

  /**
   * Determines if this browser tab is sharing its map actions
   */
  sharing: boolean = false

  /**
   * Determines if this browser tab is listening for shared map actions
   */
  listening: boolean = false

  /**
   * Reports if this browser tab is sharing its map actions
   */
  public isSharing() {
    return this.sharing
  }

  /**
   * Reports if this browser tab is listening for shared map actions
   */
  public isListening() {
    return this.listening
  }

  /**
   * Called to share map events with others. This will check to make sure you are sharing first. 
   */
  public shareEvent(data: any) {
    if (this.isSharing()) {
      const event = new ShareEvent()
      event.browserId = DataService.BrowserId
      event.userId = this.user.getValue().id

      if (data) {
        event.data = data
      }

      const path = '/sharing/' + this.game.getValue().id + "/event"
      console.log("Sending Share Event", event)

      this.db.object(path).set(event)
    }
  }

  /**
   * Creates an observable for listening to shared events. This checks if you are listening 
   * 
   * @param gameid Game ID
   */
  sharedEvents$(gameid: String): Observable<ShareEvent> {
    const path = '/sharing/' + this.game.getValue().id + "/event"
    return this.db.object<ShareEvent>(path).valueChanges().pipe(
      filter(event => this.isListening()),
      filter(event => event !== null),
      filter(event => event.browserId !== DataService.BrowserId)
    )
  }

  // ----------------------------------------------------------------------------------------------
  // Active Encounter for a Map
  // ----------------------------------------------------------------------------------------------
  // Active Encouters are the encounters that are current. THere is one active encounter per map. 
  // multiple open encounters can be cycled through. The active encouter is the focused one. 
  // 
  // The active encounter is stored under /active/gameid/map/mapid/encounter
  // ----------------------------------------------------------------------------------------------

  /**
   * Activates this encounter. This is used to activate and update the encounter
   * 
   * @param encounter 
   */
  activateEncounter(encounter: Encounter) {
    const gameid = encounter.owner
    const mapid = encounter.mapInfo.mapId
    const path = `/active/${gameid}/maps/${mapid}/encounter`
    // this.db.object(path).set(encounter) 
    this.save(encounter, path)
  }

  /**
   * Completes the encounter, adds it to the historical record and deactivates it
   */
  completeEncounter(encounter: Encounter) {
    throw ('NOT IMPLEMENTED')
  }

  /**
   * Removes the active encounter. This will happen when the encounter is complete. 
   * @param gameid 
   * @param mapid 
   */
  deactivateEncounter(gameid: string, mapid: string) {
    const path = `/active/${gameid}/maps/${mapid}/encounter`
    this.db.object(path).remove()
  }

  /**
   * The active encounter will change when the encouter is updated or a new encounter
   * is updated. This allows the system to react appropriately
   * @param gameid 
   * @param mapid 
   */
  getActiveEncounter$(gameid: string, mapid: string): Observable<Encounter> {
    const path = `/active/${gameid}/maps/${mapid}/encounter`
    return this.db.object<Encounter>(path).valueChanges().pipe(map(item => item ? Encounter.to(item) : null))
  }

  // ----------------------------------------------------------------------------------------------
  // Caching
  // ----------------------------------------------------------------------------------------------
  // Active Encouters are the encounters that are current. THere is one active encounter per map. 
  // multiple open encounters can be cycled through. The active encouter is the focused one. 
  // 
  // The active encounter is stored under /active/gameid/map/mapid/encounter
  // ----------------------------------------------------------------------------------------------

  /**
   * Publishes the package to the storage
   * @param path 
   */
  async publishCached(path: string) {
    const currentVersion = this.cache.version(path)
    const data = await this.cache.get(path).toPromise()
    console.log("DATA", data)

    const blob = JSON.stringify(data)
    console.log("BLOB", blob)
    const version = currentVersion == -2 ? 1 : currentVersion + 1

    const item = new CachedItem()
    item.path = path
    item.version = version

    // Create the new package and upload
    const storagePath = `${path}_v${version}.json`
    const storagePathOld = `${path}_v${currentVersion}.json`

    console.log(`Publishing local changes. ${path} adding version ${version} to storage ${storagePath} and deleteing ${storagePathOld}`)

    // Save the data to firesbase storage. Wait for this to complete
    await this.storage.ref(storagePath).putString(blob).percentageChanges().toPromise()
    await this.fillInMyUrl(item, storagePath, "url").toPromise()
    await this.cache.saveToInventory$(item).toPromise()
    await this.db.object(item.path).set(item)

    // this.storage.ref(storagePathOld).delete() 
    this.notify.success(`Local version published to ${path}`)

  }

  // ----------------------------------------------------------------------------------------------
  // Debuging
  // ----------------------------------------------------------------------------------------------
  // Try to keep a count on how many records show up each time
  // ----------------------------------------------------------------------------------------------

  received = {}
  record(type: string, recs: number) {
    if (!this.received[type]) {
      this.received[type] = []
    }
    this.received[type].push(recs)
  }


  // ----------------------------------------------------------------------------------------------
  // Tokens
  // ----------------------------------------------------------------------------------------------
  // Methods for dealing with tokens
  // ----------------------------------------------------------------------------------------------
  getTokenCharacter(token: TokenAnnotation): Character {
    if (token.itemType == Character.TYPE) {
      return this.gameAssets.characters.currentItems.find(i => i.id == token.itemId)
    }
    if (token.itemType == Monster.TYPE) {
      if (!token.calcCharacter) {
        const m = this.pathfinder.monsters$.getValue().find(i => i.id == token.itemId)
        if (m) {
          token.calcCharacter = MonsterToCharacter.convert(m)
        }
      }

      return token.calcCharacter
    }
    if (token.itemType == Token.TYPE) {
      return token.calcCharacter
    }
  }

  getTokenItem(token: TokenAnnotation): Character | Monster | Token {
    const itemType = token.itemType
    const itemId = token.itemId

    if (itemType == Character.TYPE) {
      return this.gameAssets.characters.currentItems.find(i => i.id == itemId)
    }
    if (itemType == Monster.TYPE) {
      return this.pathfinder.monsters$.getValue().find(i => i.id == itemId)
    }
    if (itemType == Token.TYPE) {
      return this.gameAssets.tokens.currentItems.find(i => i.id == itemId)
    }
  }

}



