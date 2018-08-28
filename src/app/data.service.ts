import { Injectable } from "@angular/core";
import { AngularFireStorage } from "angularfire2/storage";
import { NotifyService, Debugger } from "./notify.service";
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { MapType, MapConfig, MarkerCategory, MarkerType, MapPrefs, Prefs, UserAssumedAccess, MergedMapType, Category, ObjectType, MarkerGroup, Annotation, MarkerTypeAnnotation, ImageAnnotation, ItemAction, User, Online, Game, GameSystem, Restricition } from "./models";
import { ReplaySubject, BehaviorSubject, Subject, Observable, of, Subscription, combineLatest, forkJoin, concat } from "rxjs";
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
import { MonsterIndex, MonsterText } from "./models/monsterdb";
import { ImageSearchResult } from "./util/GoogleImageSearch";
import { Pathfinder } from "./models/gamesystems/pathfinder";
import { DataAsset } from "./data-asset";
import { Item } from "./items/item";

export class GameAssets {
  annotationFolders = new DataAsset<MarkerGroup>(MarkerGroup.TYPE)
  annotations = new DataAsset<Annotation>(Annotation.TYPE)
  characterTypes = new DataAsset<CharacterType>(CharacterType.TYPE)
  characters = new DataAsset<Character>(Character.TYPE)
  encounters = new DataAsset<Encounter>(Encounter.TYPE)
  maps = new DataAsset<MapConfig>(MapConfig.TYPE)
  mapTypes = new DataAsset<MapType>(MapType.TYPE)
  markerCategories = new DataAsset<MarkerCategory>(MarkerCategory.TYPE)
  markerTypes = new DataAsset<MarkerType>(MarkerType.TYPE)
  monsters = new DataAsset<MonsterIndex>(MonsterIndex.TYPE)
  items = new DataAsset<Item>(Item.TYPE)

  subscribeAll(game$: Observable<Game>, notify: NotifyService, data: DataService) {
    this.annotationFolders.subscribe(game$, notify, data)
    this.annotations.subscribe(game$, notify, data)
    this.characterTypes.subscribe(game$, notify, data)
    this.characters.subscribe(game$, notify, data)
    this.encounters.subscribe(game$, notify, data)
    this.maps.subscribe(game$, notify, data)
    this.mapTypes.subscribe(game$, notify, data)
    this.markerCategories.subscribe(game$, notify, data)
    this.markerTypes.subscribe(game$, notify, data)
    this.monsters.subscribe(game$, notify, data)
    this.items.subscribe(game$, notify, data)
  }
}

@Injectable({
  providedIn: 'root'
})
export class DataService {


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

  // mapTypes = new ReplaySubject<Array<MapType>>(1)
  // maps = new ReplaySubject<Array<MapConfig>>(1)
  // markerCategories = new ReplaySubject<Array<MarkerCategory>>(1)
  // markerTypes = new ReplaySubject<Array<MarkerType>>(1)
  mapTypesWithMaps = new ReplaySubject<Array<MergedMapType>>(1)
  categories = new ReplaySubject<Array<Category>>(1)
  // characters = new ReplaySubject<Array<Character>>(1)
  // characterTypes = new ReplaySubject<Array<CharacterType>>(1)
  // encounters = new ReplaySubject<Array<Encounter>>(1)
  // monsters = new BehaviorSubject<Array<MonsterIndex>>([])

  monstersLoading = new BehaviorSubject<boolean>(true)
  charactersLoading = new BehaviorSubject<boolean>(true)

  mapsCurrent: MapConfig[] = []

  ready = new BehaviorSubject<boolean>(false)
  saves = new Subject<any>()

  markerTypeChanges$ = new ReplaySubject<ItemAction<MarkerType>>()
  // markerTypesAll = new BehaviorSubject<Array<MarkerType>>([])

  subs: Subscription[] = []

  // User & Assumed Groups ->  Map Configs
  constructor(private afAuth: AngularFireAuth, private notify: NotifyService, private storage: AngularFireStorage, public db: AngularFireDatabase) {
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
      mergeMap(user => this.getUserInfo(user))
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
      tap(p => this.log.info("Map Prefs Loaded: ", p))
    ).subscribe(p => this.userMapPrefs.next(MapPrefs.to(p)))

    // Prefs
    this.user.pipe(
      mergeMap(u => this.getOrCreate(u.id, new Prefs())),
      tap(p => this.log.info("Map Prefs Loaded: ", p))
    ).subscribe(p => this.userPrefs.next(Prefs.to(p)))

    // Access
    this.user.pipe(
      mergeMap(u => this.getOrCreate(u.id, new UserAssumedAccess)),
      tap(p => this.log.info("Map Prefs Loaded: ", p))
    ).subscribe(p => this.userAccess.next(UserAssumedAccess.to(p)))
  }

  loadGamesystems() {
    const gs = []
    gs.push(Pathfinder.make())

    this.gamesystems.next(gs)
  }

  // User -> Map Types, Marker Types, Marker Categories, User Groups, Users
  loadDataFromUser() {
    // this.syncArray<UserGroup>(this.groups.value, UserGroup.FOLDER, 'Loading User Groups')
    // this.syncArray<User>(this.users.value, User.FOLDER, 'Loading Users')
    // this.syncArray<MapType>(this.mapTypes.value, MapType.FOLDER, 'Loading Map Types', this.mergeMapAndType)
    // this.syncArray<MarkerType>(this.markerTypes.value, MarkerType.FOLDER, 'Loading Marker Types', this.mergeMarkersAndCategories)
    // this.syncArray<MarkerCategory>(this.markerCategories.value, MarkerCategory.FOLDER, 'Loading MarkerCategory', this.mergeMarkersAndCategories)

    // this.loadAndNotify<User>(this.users, 'users', 'Loading Users')
    this.loadUsers()
    this.loadAndNotify<Game>(this.games, 'games', 'Loading Games')
    // this.loadAndNotify<MapType>(this.mapTypes, 'mapTypes', 'Loading Map Types')
    // this.loadAndNotify<MarkerType>(this.markerTypes, 'markerTypes', 'Loading Marker Types')
    // this.loadAndNotify<MarkerCategory>(this.markerCategories, 'markerCategories', 'Loading Marker Categories')
    // this.loadAndNotify<Character>(this.characters, Character.FOLDER, 'Loading Characters', undefined, this.charactersLoading)
    // this.loadAndNotify<Encounter>(this.encounters, Encounter.FOLDER, 'Loading Encounters')
    // this.loadAndNotify<MonsterIndex>(this.monsters, MonsterIndex.FOLDER, 'Loading Monsters')
    // this.pageMonsters()
    // this.loadCharacterTypes()
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
    obj['uid'] = uid
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

  // getAnnotations$(mapId: string): Observable<Annotation[]> {
  //   return this.gameAssets.annotations.items$.pipe(
  //     map(items => items.filter(item => item.map == mapId))
  //   )
  // }

  // getAnnotationGroups$(mapId: string): Observable<MarkerGroup[]> {
  //   return this.gameAssets.annotationFolders.items$.pipe(
  //     map(items => items.filter(item => item.map == mapId))
  //   )
  // }

  getAnnotations$(mapId: string): Observable<ItemAction<Annotation>> {
    return this.game.pipe(
      map(game => DbConfig.pathFolderTo(Annotation.TYPE, game.id)),
      mergeMap(path => this.db.list(path, ref => ref.orderByChild('map').equalTo(mapId)).stateChanges()),
      map(item => new ItemAction(item.type, DbConfig.toItem(item.payload.val())))
    )
  }

  getAnnotationGroups$(mapId: string): Observable<ItemAction<MarkerGroup>> {
    return this.game.pipe(
      map(game => DbConfig.pathFolderTo(MarkerGroup.TYPE, game.id)),
      mergeMap(path => this.db.list(path, ref => ref.orderByChild('map').equalTo(mapId)).stateChanges()),
      map(item => new ItemAction(item.type, DbConfig.toItem(item.payload.val())))
    )
  }

  getAnnotations(mapid: string): Observable<Array<Annotation>> {
    return this.gameAssets.annotations.items$
      .pipe(
        tap(items => console.log("ALL ANNOTATIONS", items.length)),
        map(items => items.filter(item => item.map == mapid)),
        tap(items => console.log("ANNOTATIONS for this map", items.length)),
        map(items => items.filter(item => this.canView(item))),
        tap(items => console.log("viewable ANNOTATIONS", items)
        )
      )
  }

  getCompleteAnnotationGroups(mapid: string): Observable<Array<MarkerGroup>> {
    let annotationObs = this.user.pipe(
      mergeMap(u => this.getAnnotations(mapid))
    )
    let groupObs = this.user.pipe(
      mergeMap(u => this.getMarkerGroups(mapid))
    )

    return combineLatest(this.gameAssets.markerTypes.items$, groupObs, annotationObs).pipe(
      map(value => {
        this.log.debug(`Loading Complete Marker Groups for ${mapid} with ${value[1].length} Groups`)
        let markerTypes = value[0]
        let loadedGroups = value[1]
        let annotations = value[2]
        let groups = []
        loadedGroups.forEach(grp => {
          grp._annotations = annotations.filter(m => m.group == grp.id)
          groups.push(grp)
        })

        let uncat = new MarkerGroup()
        uncat.id = DataService.UNCATEGORIZED
        uncat.name = "Ungrouped"
        uncat._annotations = annotations.filter(m => (!m.group || m.group == ''))
        if (uncat._annotations.length > 0) {
          groups.push(uncat)
        }
        return groups
      })
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
    if (obj.view && obj.view.length > 0) {
      return true
    }
    if (obj.edit && obj.edit.length > 0) {
      return true
    }
    return false
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
    if (this.game.value) {
      return this.game.value.gms.includes(user.id)
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

  // filterRestrictedContent(item: IAsset) {
  //   console.log("FILTERING", item);

  //   if (!item.restrictedContent) {
  //     console.log("NO RESTRICTED CONTENT>>>");
  //     return item
  //   }

  //   const restrictedCopy = DbConfig.toItem(item)
  //   Object.keys(restrictedCopy.restrictedContent).forEach(field => {
  //     console.log("CHECKING FIELD ", field);
  //     if (!this.canViewField(item, field)) {
  //       console.log("REMOVING FIELD ", field);
  //       delete restrictedCopy[field]
  //     } else {
  //       console.log("NOT RESTRICTED ", field);
  //     }
  //     restrictedCopy['__FILTERED__'] = true
  //   })
  //   console.log("filterRestrictedContent", item, restrictedCopy)
  //   return restrictedCopy
  // }

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

  save(item: ObjectType) {
    // Copy the Item so we only save a normal javascript object, and remove all the bad
    // let toSave = LangUtil.clean(Object.assign({}, item))
    // Remove the fields that are not part of the object that should be saved in the database
    // LangUtil.trimExtraneousFields(toSave, this.sample(item))
    this.assignId(item)
    const toSave = LangUtil.prepareForStorage(item)

    // Get path to the object
    let path = DbConfig.dbPath(item)
    console.log('Saving Item ', toSave, path)

    this.db.object(path).set(toSave).then(() => {
      // this.notify.success("Saved " + path)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving " + path)
    })
    this.saves.next(item)
  }

  saveMap(map: MapConfig, image?: Blob, thumb?: Blob) {
    this.log.debug('Saving Map ', map.name)

    if (thumb && image) {
      let pathImage = 'images/' + map.id
      let pathThumb = 'images/' + map.id + "_thumb"
      console.log("Preparing to save Map DATA", map);

      forkJoin(this.saveImage(image, pathImage), this.saveImage(thumb, pathThumb)).pipe(
        mergeMap(result => this.fillInMapUrl(map)),
        mergeMap(result => this.fillInMapThumb(map))
      ).subscribe(() => {
        console.log("Saving Map DATA", map);
        this.save(map)
      }, err => {
        this.log.debug("ERROR");
        this.log.debug(err);
      }, () => {
        this.log.debug("Complete");
      })

    } else {
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
      this.save(item)
    }, err => {
      this.log.debug("ERROR");
      this.log.debug(err);
    }, () => {
      this.log.debug("Complete");
    })
  }

  saveImage(data: Blob, path: string) {
    console.log("Saving Map Blob " + path);

    const ref = this.storage.ref(path)
    let loadProgress = new Subject<number>()
    loadProgress.subscribe(this.notify.progress("Loading Image"))

    const task = ref.put(data)
    task.percentageChanges()
      .subscribe(loadProgress)

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
      item.id = UUID.UUID().toString()
    } else if (item.id == 'TEMP') {
      item.id = UUID.UUID().toString()
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

  getMonsterText(id: string): Observable<MonsterText> {
    return this.db.object<MonsterText>(MonsterText.FOLDER + "/" + id).valueChanges()
  }

  loadMonsters(index: MonsterIndex[], text: MonsterText[], deleteOld?: boolean) {
    if (deleteOld) {

    }

    // Load the index
    this.saveAll(...index)
    this.saveAll(...text)
  }

  // getMonstersPaged(limit: number, startAt: string): Observable<MonsterIndex[]> {

  //   if (startAt) {
  //     return this.db.list<MonsterIndex>(MonsterIndex.FOLDER,
  //       ref => ref.orderByChild('id').startAt(startAt).limitToFirst(limit + 1)).valueChanges().pipe(take(1))
  //   } else {
  //     return this.db.list<MonsterIndex>(MonsterIndex.FOLDER,
  //       ref => ref.orderByChild('id').limitToFirst(limit + 1)).valueChanges().pipe(take(1))
  //   }
  // }

  // monsterStart = undefined
  // pageMonsters() {
  //   this.getMonstersPaged(300, this.monsterStart).subscribe(items => {
  //     if (items.length > 1) {
  //       this.monsterStart = items[items.length - 1].id
  //       this.pageMonsters()
  //     } else {
  //       this.monstersLoading.next(false)
  //     }
  //     let current = this.monsters.getValue()
  //     let next = []
  //     next.push(...current)
  //     next.push(...items.slice(0, 300))
  //     this.monsters.next(next)
  //   })
  // }




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

}



