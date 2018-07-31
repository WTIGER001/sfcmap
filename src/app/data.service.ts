import { Injectable } from "@angular/core";
import { AngularFireStorage } from "angularfire2/storage";
import { NotifyService, Debugger } from "./notify.service";
import { AngularFireDatabase, AngularFireAction, DatabaseSnapshot } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { User, MapType, MapConfig, UserGroup, MarkerCategory, MarkerType, MapPrefs, Prefs, UserAssumedAccess, MergedMapType, Category, ObjectType, MarkerGroup, Annotation, MarkerTypeAnnotation, ImageAnnotation, ItemAction } from "./models";
import { ReplaySubject, BehaviorSubject, Subject, Observable, of, Subscription, combineLatest, forkJoin, concat } from "rxjs";
import { mergeMap, map, tap, first, concatMap } from "rxjs/operators";
import { DbConfig } from "./models/database-config";
import { LangUtil } from "./util/LangUtil";
import { UUID } from "angular2-uuid";
import { isArray } from "util";

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

  /**
   * Observables
   */
  user = new BehaviorSubject<User>(DataService.NOBODY)

  userPrefs = new BehaviorSubject<Prefs>(new Prefs())
  userMapPrefs = new BehaviorSubject<MapPrefs>(new MapPrefs())
  userAccess = new BehaviorSubject<UserAssumedAccess>(new UserAssumedAccess())
  // mapTypes = new BehaviorSubject<Array<MapType>>([])
  // maps = new BehaviorSubject<Array<MapConfig>>([])
  users = new BehaviorSubject<Array<User>>([])
  // groups = new BehaviorSubject<Array<UserGroup>>([])
  // markerCategories = new BehaviorSubject<Array<MarkerCategory>>([])
  // markerTypes = new BehaviorSubject<Array<MarkerType>>([])
  // mapTypesWithMaps = new BehaviorSubject<Array<MergedMapType>>([])
  // categories = new BehaviorSubject<Array<Category>>([])

  // userPrefs = new ReplaySubject<Prefs>(1)
  // userMapPrefs = new ReplaySubject<MapPrefs>(1)
  // userAccess = new ReplaySubject<UserAssumedAccess>(1)
  mapTypes = new ReplaySubject<Array<MapType>>(1)
  maps = new ReplaySubject<Array<MapConfig>>(1)
  // users = new ReplaySubject<Array<User>>(1)
  groups = new ReplaySubject<Array<UserGroup>>(1)
  markerCategories = new ReplaySubject<Array<MarkerCategory>>(1)
  markerTypes = new ReplaySubject<Array<MarkerType>>(1)
  mapTypesWithMaps = new ReplaySubject<Array<MergedMapType>>(1)
  categories = new ReplaySubject<Array<Category>>(1)

  mapsCurrent: MapConfig[] = []

  ready = new BehaviorSubject<boolean>(false)
  saves = new Subject<any>()

  markerTypeChanges$ = new ReplaySubject<ItemAction<MarkerType>>()
  // markerTypesAll = new BehaviorSubject<Array<MarkerType>>([])

  subs: Subscription[] = []

  // User & Assumed Groups ->  Map Configs
  constructor(private afAuth: AngularFireAuth, public db: AngularFireDatabase, private notify: NotifyService, private storage: AngularFireStorage) {
    this.log = this.notify.newDebugger("Data")

    this.setUpSubscriptions()
  }

  setUpSubscriptions() {
    this.subscribeToUserLogon()
    this.loadUserExtensions()
    this.loadDataFromUser()
    this.loadMaps()
    this.loadMergedMapTypes()
    this.loadCategories()
  }

  /**
   * Subscribe to the user logon event from firebase and load / create the real user as necessary
   */
  subscribeToUserLogon() {
    // Subscribe to the firebase user. This can be null or a firebase user. When we get a user or a null value we reload all the data
    this.afAuth.user.pipe(
      tap(fireUser => this.log.info("User Logged In: ", fireUser.displayName)),
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
      mergeMap(u => this.getOrCreate(u.uid, new MapPrefs())),
      tap(p => this.log.info("Map Prefs Loaded: ", p))
    ).subscribe(p => this.userMapPrefs.next(MapPrefs.to(p)))

    // Prefs
    this.user.pipe(
      mergeMap(u => this.getOrCreate(u.uid, new Prefs())),
      tap(p => this.log.info("Map Prefs Loaded: ", p))
    ).subscribe(p => this.userPrefs.next(Prefs.to(p)))

    // Access
    this.user.pipe(
      mergeMap(u => this.getOrCreate(u.uid, new UserAssumedAccess)),
      tap(p => this.log.info("Map Prefs Loaded: ", p))
    ).subscribe(p => this.userAccess.next(UserAssumedAccess.to(p)))
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
    this.loadAndNotify<UserGroup>(this.groups, 'groups', 'Loading User Groups')
    this.loadAndNotify<MapType>(this.mapTypes, 'mapTypes', 'Loading Map Types')
    this.loadAndNotify<MarkerType>(this.markerTypes, 'markerTypes', 'Loading Marker Types')
    this.loadAndNotify<MarkerCategory>(this.markerCategories, 'markerCategories', 'Loading Marker Categories')
  }

  // private mergeMarkersAndCategories(item: any, type: string) {
  //   if (MarkerType.is(item)) {
  //     // Look for the category
  //     let type = item.category
  //     const mt = this.categories.value.find(mt => mt.id === type)
  //     if (type == 'child_added' && mt) {
  //       mt.types.push(item)
  //     } else if (type == 'child-removed' && mt) {
  //       let inx = mt.types.findIndex(m => m.id == item.id)
  //       if (inx >= 0) {
  //         mt.types.splice(inx, 1)
  //       }
  //     }
  //     this.markerTypeChanges$.next(new ItemAction(type, item))
  //   } else if (MarkerCategory.is(item) && type == 'child_added') {
  //     let merged = this.categories.value.find(mt => mt.id === item.id)
  //     if (!merged) {
  //       merged = new Category()
  //     }
  //     if (merged.types && merged.types.length > 0) {
  //       merged.types.splice(0)
  //     }
  //     merged.name = item.name
  //     merged.appliesTo = item.appliesTo
  //     merged.id = item.id
  //     merged.types = this.markerTypes.value.filter(m => m.category == merged.id && this.canView(m))
  //     this.categories.value.push(merged)
  //   }
  // }

  // private mergeMapAndType(item: any, type: string) {
  //   if (MapConfig.is(item)) {
  //     if (type == 'child_added') {
  //       // Look for the category
  //       let type = item.mapType
  //       const mt = this.mapTypesWithMaps.value.find(mt => mt.id === type)
  //       if (mt) {
  //         mt.maps.push(item)
  //       }
  //     } else if (type == 'child-removed') {
  //       let type = item.mapType
  //       const mt = this.mapTypesWithMaps.value.find(mt => mt.id === type)
  //       if (mt) {
  //         let inx = mt.maps.findIndex(m => m.id == item.id)
  //         if (inx >= 0) {
  //           mt.maps.splice(inx, 1)
  //         }
  //       }
  //     }
  //   } else if (MapType.is(item) && type == 'child_added') {
  //     let merged = this.mapTypesWithMaps.value.find(mt => mt.id === item.id)
  //     if (!merged) {
  //       merged = new MergedMapType()
  //     }
  //     if (merged.maps && merged.maps.length > 0) {
  //       merged.maps.splice(0)
  //     }
  //     merged.name = item.name
  //     merged.order = item.order
  //     merged.id = item.id
  //     merged.defaultMarker = item.defaultMarker
  //     merged.maps = this.maps.value.filter(m => m.mapType == merged.id && this.canView(m))
  //     this.mapTypesWithMaps.value.push(merged)
  //   }
  // }

  // syncArray<T extends ObjectType>(arr: Array<T>, folderName: string, errorType: string, mergeFn?: (item: any, type: string) => void) {
  //   this.log.debug('Begining of SyncArray ' + folderName)
  //   let sub = this.user.pipe(
  //     tap(user => this.users.value.splice(0)),
  //     mergeMap(user => user.uid === 'NOBODY' ? of(undefined) : this.db.list<T>(folderName).stateChanges())
  //   ).subscribe(
  //     item => {
  //       if (!item) {
  //         return
  //       }
  //       try {
  //         let i = <AngularFireAction<DatabaseSnapshot<T>>>item
  //         let u = DbConfig.toItem(i.payload.val())

  //         if (i.type == 'child_added') {
  //           arr.push(u)
  //           if (mergeFn) {
  //             mergeFn.call(this, u, i.type)
  //             // mergeFn(u, i.type)
  //           }
  //         } else if (i.type == 'child_removed') {
  //           const idx = arr.findIndex(me => me['id'] == u.id)
  //           if (idx >= 0) {
  //             arr.splice(idx, 1)
  //           }
  //         }
  //       } catch (err) {
  //         this.log.error("Error Loading ", name, err)
  //       }
  //     }
  //   )
  //   this.subs.push(sub)
  // }


  loadUsers() {
    let sub = this.user.pipe(
      tap(user => this.users.value.splice(0)),
      mergeMap(user => user.uid === 'NOBODY' ? of({}) : this.db.list<User>('users').stateChanges())
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
            const idx = this.users.value.findIndex(me => me.uid == u.uid)
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


  // Maps
  loadMaps() {
    this.userAccess.pipe(
      mergeMap(ua => ua.uid === 'NOBODY' ? of([]) : this.db.list(MapConfig.FOLDER).valueChanges()),
      tap(maps => { this.mapsCurrent.splice(0), this.mapsCurrent.push(...maps) })
    ).subscribe(maps => this.receiveArray(maps, this.maps))
  }

  // Merged 
  loadMergedMapTypes() {
    combineLatest(this.maps, this.mapTypes).subscribe(
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
    combineLatest(this.markerCategories, this.markerTypes).subscribe(
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
    this.log.debug("Getting User Information for " + u.uid);
    if (u == null || u.uid == 'NOBODY') {
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


  private loadAndNotify<T>(subject: Subject<Array<T>>, name: string, errorType: string, current?: Array<T>) {
    this.log.debug('Base Item loadAndNotify ' + name)

    let sub = this.user.pipe(
      mergeMap(user => user.uid === 'NOBODY' ? of([]) : this.db.list<T>(name).valueChanges())
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
        subject.next(items)
      },
      error => {
        this.notify.showError(error, errorType)
      }
    )
    this.subs.push(sub)
  }

  getAnnotations$(mapId: string): Observable<ItemAction<Annotation>> {
    return this.db.list(Annotation.FOLDER + '/' + mapId)
      .stateChanges()
      .pipe(
        map(item => {
          return new ItemAction(item.type, DbConfig.toItem(item.payload.val()))
        })
      )
  }

  getAnnotationGroups$(mapId: string): Observable<ItemAction<MarkerGroup>> {
    return this.db.list(MarkerGroup.FOLDER + '/' + mapId)
      .stateChanges()
      .pipe(
        map(item => {
          return new ItemAction(item.type, DbConfig.toItem(item.payload.val()))
        })
      )
  }

  getAnnotations(mapid: string): Observable<Array<Annotation>> {
    return this.db.list(Annotation.FOLDER + '/' + mapid)
      .snapshotChanges()
      .pipe(
        map(items => {
          let all = new Array<Annotation>()
          items.forEach(m => {
            let pojo = <Annotation>m.payload.val()
            let saved = Annotation.to(pojo)
            if (this.canView(saved)) {
              all.push(saved)
            }
          })
          return all;
        })
      )
  }

  getCompleteAnnotationGroups(mapid: string): Observable<Array<MarkerGroup>> {
    let annotationObs = this.user.pipe(
      mergeMap(u => this.getAnnotations(mapid))
    )
    let groupObs = this.user.pipe(
      mergeMap(u => this.getMarkerGroups(mapid))
    )

    return combineLatest(this.markerTypes, groupObs, annotationObs).pipe(
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

  getMarkers(mapid: string): Observable<Array<MarkerTypeAnnotation>> {
    return this.db.list('markers/' + mapid)
      .snapshotChanges()
      .pipe(
        map(items => {
          let markers = new Array<MarkerTypeAnnotation>()
          items.forEach(m => {
            let saved = MarkerTypeAnnotation.to(m.payload.val())
            if (this.canView(saved)) {
              markers.push(<MarkerTypeAnnotation>saved)
            }
          })
          return markers;
        })
      )
  }

  private getMarkerGroups(mapid: string): Observable<Array<MarkerGroup>> {
    return this.db.list('markerGroups/' + mapid)
      .snapshotChanges()
      .pipe(
        map(items => {
          let groups = new Array<MarkerGroup>()
          items.forEach(m => {
            let saved = MarkerGroup.to(m.payload.val())
            if (this.canView(saved)) {
              groups.push(<MarkerGroup>saved)
            }
          })
          return groups;
        })
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

  /**
    * Determines if the current user can view an item.
    * @param item The item to check
    */
  canView(item: any): any {
    if (!item['view']) {
      return true
    }
    let view: Array<string> = item['view']
    if (view.length == 0) {
      return true
    }
    if (this.isReal) {
      return view.includes(this.user.getValue().uid) || LangUtil.arrayMatch(view, this.userAccess.getValue().assumedGroups)
    }
    return false
  }

  /**
   * Determines if the current user can edit an item.
   * @param item The item to check
   */
  canEdit(item: any): any {
    if (!item['edit']) {
      return true
    }
    let edit: Array<string> = item['edit']
    if (edit.length == 0) {
      return true
    }
    if (this.isReal) {
      return edit.includes(this.user.getValue().uid) || LangUtil.arrayMatch(edit, this.userAccess.getValue().assumedGroups)
    }
    return false
  }

  isReal(): any {
    return this.user.getValue().uid != "NOBODY"
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
    this.log.info('Saving Item ', toSave)

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

  delete(item: ObjectType) {
    if (UserGroup.is(item)) {
      this.completeUserGroupDelete(item)
    } else if (MapConfig.is(item)) {
      this.deleteImages(item)
    }

    let path = DbConfig.dbPath(item)

    // let path = this.dbPath(item)
    this.db.object(path).remove().then(() => {
      this.notify.success("Removed ")
    }).catch(reason => {
      this.notify.showError(reason, "Error Deleting Map")
    })
  }

  private deleteImages(item: MapConfig) {
    this.storage.ref('images/' + item.id).delete()
    this.storage.ref('images/' + item.id + "_thumb").delete()
  }

  deleteMap(item: MapConfig) {
    this.db.object('maps/' + item.id).remove().then(() => {
      this.notify.success("Removed " + item.name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Deleting Map")
    })

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

  // Deletes the access id from all the things necessary
  completeUserGroupDelete(grp: UserGroup): any {
    this.db.list<UserAssumedAccess>(UserAssumedAccess.FOLDER).valueChanges().pipe(first()).subscribe(ua => {
      ua.forEach(u => {
        let id = this.remove(u.assumedGroups, grp.id)
        let name = this.remove(u.assumedGroups, grp.name)
        if (id || name) {
          this.save(User.to(u))
        }
      })
    })

    this.db.list<MapConfig>(MapConfig.FOLDER).valueChanges().pipe(first()).subscribe(items => {
      console.log("Checking on Maps");
      this.removeGroup(items, grp)
    })

    this.db.list<MapType>(MapType.FOLDER).valueChanges().pipe(first()).subscribe(items => {
      console.log("Checking on Map Type");
      this.removeGroup(items, grp)
    })

    this.db.list<MarkerType>(MarkerType.FOLDER).valueChanges().pipe(first()).subscribe(items => {
      console.log("Checking on Marker Type");
      this.removeGroup(items, grp)
    })

    this.db.list<MarkerType>(MarkerCategory.FOLDER).valueChanges().pipe(first()).subscribe(items => {
      console.log("Checking on Marker Category");
      this.removeGroup(items, grp)
    })

    this.db.list<MapConfig>(MapConfig.FOLDER).valueChanges().pipe(
      first(),
      concatMap(m => m),
      tap(m => console.log("MAP ", m.id)),
      mergeMap(m => this.db.list<MarkerGroup>(MarkerGroup.FOLDER + "/" + m.id).valueChanges())
    ).subscribe(all => {
      console.log("Checking on Marker Group");
      this.removeGroup(all, grp)
    })

    this.db.list<MapConfig>(MapConfig.FOLDER).valueChanges().pipe(
      first(),
      concatMap(m => m),
      tap(m => console.log("MAP ", m.id)),
      mergeMap(m => this.db.list<Annotation>(Annotation.FOLDER + "/" + m.id).valueChanges())
    ).subscribe(all => {
      console.log("Checking on Annotations");
      this.removeGroup(all, grp)
    })

  }


  private removeGroup(items: any[], grp: UserGroup) {
    items.forEach(raw => {
      let item = DbConfig.toItem(raw)
      let viewId = this.remove(item.view, grp.id)
      let viewName = this.remove(item.view, grp.name)
      let editId = this.remove(item.edit, grp.id)
      let editName = this.remove(item.edit, grp.name)
      if (viewId || viewName || editId || editName) {
        this.save(item)
      }
    })
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

  restrictSummary(item: any): string {
    let viewUserNames = []
    let viewGroupNames = []
    let editUserNames = []
    let editGroupNames = []
    if (item.view) {
      item.view.forEach(i => {
        let match = this.users.getValue().find(u => u.uid == i)
        if (match) {
          viewUserNames.push(match.name)
        } else {
          viewGroupNames.push(i)
        }
      })
    }
    if (item.edit) {
      item.edit.forEach(i => {
        let match = this.users.getValue().find(u => u.uid == i)
        if (match) {
          editUserNames.push(match.name)
        } else {
          editGroupNames.push(i)
        }
      })
    }

    let result = ''
    if (viewUserNames.length > 0 || viewGroupNames.length > 0) {
      result += 'View Restrictions\n'
      result += 'Groups: '
      result += viewGroupNames.length > 0 ? viewGroupNames.join(",") : 'None'
      result += '\nUsers: '
      result += viewUserNames.length > 0 ? viewUserNames.join(",") : 'None'
      result += '\n'
    } else {
      result += 'View Restrictions: None\n'
    }

    if (editGroupNames.length > 0 || editUserNames.length > 0) {
      result += 'Edit Restrictions\n'
      result += 'Groups: '
      result += editGroupNames.length > 0 ? editGroupNames.join(",") : 'None'
      result += '\nUsers: '
      result += editUserNames.length > 0 ? editUserNames.join(",") : 'None'
    } else {
      result += 'Edit Restrictions: None\n'
    }
    if (editGroupNames.length > 0 && editUserNames.length > 0 && viewGroupNames.length > 0 && viewGroupNames.length > 0) {
      result = 'No Restrictions'
    }

    return result
  }
}



