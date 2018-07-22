import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, zip, range, combineLatest, forkJoin, BehaviorSubject, of, interval, Subscription, Subject, concat, timer } from 'rxjs';
import { MapType, MapConfig, UserGroup, MarkerCategory, MarkerType, MergedMapType, User, IObjectType, MarkerGroup, Category } from './models';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { NotifyService, Debugger } from './notify.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { mergeMap, map, concatMap, bufferCount, tap, first, retry, retryWhen, delayWhen, delay, concatAll } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { User as FireUser } from 'firebase';
import { LangUtil } from './util/LangUtil';
import { Annotation, ShapeAnnotation, ImageAnnotation, MarkerTypeAnnotation } from './models';
import { UUID } from 'angular2-uuid';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  public static readonly UNCATEGORIZED = "UNGROUPED"
  public readonly NOBODY = new User()

  ready = new ReplaySubject<boolean>()

  // The currently logged in user
  user = new BehaviorSubject<User>(new User())

  mapTypes = new ReplaySubject<Array<MapType>>()
  maps = new ReplaySubject<Array<MapConfig>>()
  users = new ReplaySubject<Array<User>>()
  groups = new ReplaySubject<Array<UserGroup>>()
  markerCategories = new ReplaySubject<Array<MarkerCategory>>()
  markerTypes = new ReplaySubject<Array<MarkerType>>()
  // markersWithUrls = new ReplaySubject<Array<MarkerType>>()
  // mapsWithUrls = new ReplaySubject<Array<MapConfig>>()
  mapTypesWithMaps = new ReplaySubject<Array<MergedMapType>>()
  categories = new ReplaySubject<Array<Category>>()

  log: Debugger

  subs: Subscription[] = []
  _users: Array<User>

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private notify: NotifyService, private storage: AngularFireStorage) {
    this.log = this.notify.newDebugger("Data")

    // Subscribe to the firebase user. This can be null or a firebase user. When we get a user or a null value we reload all the data
    afAuth.user.subscribe(fireUser => {
      let user = User.fromFireUser(fireUser)
      this.onLogon(user)
    })

    this.users.subscribe(u => this._users = u)

    // Load the URLS for map
    // let mapBuffer = new BufferedSubscriber<MapConfig>()
    // this.maps.pipe(
    //   map(i => {
    //     mapBuffer.bufferSize = i.length;
    //     return i
    //   }),
    //   concatMap(i => i),
    //   mergeMap(m => this.fillInMapUrl(m), 5),
    //   mergeMap(m => this.fillInMapThumb(m), 5)
    // ).subscribe(item => {
    //   mapBuffer.push(item)
    //   if (mapBuffer.full()) {
    //     let items = mapBuffer.empty()
    //     this.log.debug(`Loaded URLS for all maps ... ${items.length}`)
    //     this.mapsWithUrls.next(items)
    //   }
    // })

    // Load the URLS for the markers
    // let markerBuffer = new BufferedSubscriber<MarkerType>()
    // this.markerTypes.pipe(
    //   map(i => {
    //     this.log.debug(`Loading URLS for all Markers .. Step 1... ${i.length}`)
    //     markerBuffer.bufferSize = i.length;
    //     return i
    //   }),
    //   concatMap(i => i),
    //   mergeMap(m => this.fillInUrl(m), 5)
    //   // bufferCount(markerCount[0])
    // ).subscribe(item => {
    //   markerBuffer.push(item)
    //   if (markerBuffer.full()) {
    //     let items = markerBuffer.empty()
    //     this.log.debug(`Loaded URLS for all Markers ... ${items.length}`)
    //     this.markersWithUrls.next(items)
    //   }
    // })

    //Load the Categories
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

    combineLatest(this.mapTypes, this.maps)
      .subscribe(([mts, mps]) => {
        let mergedArr = new Array<MergedMapType>()
        mts.forEach(mt => {
          let merged = new MergedMapType()
          merged.name = mt.name
          merged.order = mt.order
          merged.id = mt.id
          merged.defaultMarker = mt.defaultMarker
          merged.maps = mps.filter(m => m.mapType == merged.id && this.canView(m))
          mergedArr.push(merged)
        })
        let items = mergedArr.sort((a, b) => a.order - b.order)
        this.mapTypesWithMaps.next(items)
        this.log.debug(`Loaded Map Types With Maps ... ${items.length}`)
      })

    combineLatest(this.user, this.maps, this.mapTypes, this.markerTypes, this.markerCategories)
      .subscribe(() => {
        this.ready.next(true)
      })
  }

  onLogon(user: User) {
    // Clean up the previous subscriptions
    this.subs.forEach(sub => {
      sub.unsubscribe()
    })
    this.subs.slice(0)

    // Load the data if there is a real user
    if (user !== null && user.uid !== 'NOBODY') {
      let sub = this.getUserInfo(user).subscribe(u => this.user.next(u))
      this.subs.push(sub)
      this.loadData()
    } else {
      this.user.next(this.NOBODY)
    }

  }


  loadData() {
    this.loadAndNotify<MapType>(this.toMapType, this.mapTypes, 'mapTypes', 'Loading Map Types')
    this.loadAndNotify<MapConfig>(this.toMap, this.maps, 'maps', 'Loading Maps')
    this.loadAndNotify<User>(this.toUser, this.users, 'users', 'Loading Users')
    this.loadAndNotify<UserGroup>(this.toGroup, this.groups, 'groups', 'Loading User Groups')
    this.loadAndNotify<MarkerCategory>(this.toMarkerCategory, this.markerCategories, 'markerCategories', 'Loading Marker Categories')
    this.loadAndNotify<MarkerType>(this.toMarkerType, this.markerTypes, 'markerTypes', 'Loading Marker Types')
  }

  getAnnotations(mapid: string): Observable<Array<Annotation>> {
    return this.db.list(Annotation.FOLDER + '/' + mapid)
      .snapshotChanges()
      .pipe(
        map(items => {
          let all = new Array<Annotation>()
          items.forEach(m => {
            let pojo = <Annotation>m.payload.val()
            let saved = this.toAnnotation(pojo)
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
      mergeMap(pref => this.getAnnotations(mapid))
    )
    let groupObs = this.user.pipe(
      mergeMap(pref => this.getMarkerGroups(mapid))
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
            let saved = <MarkerTypeAnnotation>m.payload.val()
            if (this.canView(saved)) {
              markers.push(saved)
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
            let saved = this.toMarkerGroup(m.payload.val())
            if (this.canView(saved)) {
              groups.push(saved)
            }
          })
          return groups;
        })
      )
  }

  toObject(item: IObjectType): MarkerGroup | UserGroup | User | Annotation {
    if (MarkerGroup.is(item)) { return item }
    if (UserGroup.is(item)) { return item }
    if (User.is(item)) { return item }
    if (Annotation.is(item)) { return item }
  }


  save(item: IObjectType) {
    // Copy the Item so we only save a normal javascript object, and remove all the bad
    // let toSave = LangUtil.clean(Object.assign({}, item))
    // Remove the fields that are not part of the object that should be saved in the database
    // LangUtil.trimExtraneousFields(toSave, this.sample(item))
    this.assignId(item)
    const toSave = LangUtil.prepareForStorage(item)

    // Get path to the object
    let path = item.dbPath()
    this.log.info('Saving Item ', toSave)

    this.db.object(path).set(toSave).then(() => {
      // this.notify.success("Saved " + path)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving " + path)
    })
  }

  saveAll(...items) {
    items.forEach(i => this.save(i))
  }

  delete(item: IObjectType) {
    if (UserGroup.is(item)) {
      this.completeUserGroupDelete(item)
    }

    let path = item.dbPath()

    // let path = this.dbPath(item)
    this.db.object(path).remove().then(() => {
      this.notify.success("Removed ")
    }).catch(reason => {
      this.notify.showError(reason, "Error Deleting Map")
    })
  }

  deleteAll(...items) {
    items.forEach(i => this.delete(i))
  }

  private toMapType(item: any): MapType {
    let me = new MapType()
    Object.assign(me, item)

    return me
  }

  private toMap(item: any): MapConfig {
    let me = new MapConfig()
    Object.assign(me, item)
    return me
  }

  private toUser(item: any): User {
    let me = new User()
    Object.assign(me, item)
    return me
  }

  private toGroup(item: any): UserGroup {
    let me = new UserGroup()
    Object.assign(me, item)
    return me
  }

  private toMarkerCategory(item: any): MarkerCategory {
    let me = new MarkerCategory()
    Object.assign(me, item)
    return me
  }

  private toMarkerType(item: any): MarkerType {
    let me = new MarkerType()
    Object.assign(me, item)
    return me
  }

  private toMarkerGroup(item: any): MarkerGroup {
    let me = new MarkerGroup()
    Object.assign(me, item)
    return me
  }

  private toAnnotation(item: any): Annotation {
    // if (MarkerAnnotation.is(item)) {
    //   let me = new MarkerAnnotation()
    //   Object.assign(me, item)
    //   return me
    // }
    if (ShapeAnnotation.is(item)) {
      let me = new ShapeAnnotation(item.subtype)
      Object.assign(me, item)
      return me
    }
    if (ImageAnnotation.is(item)) {
      let me = new ImageAnnotation()
      Object.assign(me, item)
      return me
    }
    if (MarkerTypeAnnotation.is(item)) {
      let me = new MarkerTypeAnnotation()
      Object.assign(me, item)
      return me
    }
    console.log("BAD ANNOATION", item);
    throw new Error("Invalid Annotation")
  }

  private loadAndNotify<T>(convert: (a: any) => T, subject: ReplaySubject<Array<T>>, name: string, errorType: string, sorter?: (items: Array<T>) => void) {
    this.log.debug('Base Item loadAndNotify ' + name)

    let sub = this.user.pipe(
      mergeMap(user => {
        if (user.uid === 'NOBODY') {
          return of([])
        } else {
          return this.db.list(name).snapshotChanges()
        }
      })
    ).subscribe(
      inTypes => {
        let items = new Array<T>()
        inTypes.forEach(item => {
          let converted = convert(item.payload.val())
          if (this.canView(converted)) {
            items.push(converted)
          }
        })
        this.log.debug("Loaded " + items.length + " " + name);

        if (sorter) {
          sorter(items)
        }
        subject.next(items)
      },
      error => {
        this.notify.showError(error, errorType)
      }
    )
    this.subs.push(sub)
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

  loadMapUrls(maps: MapConfig[]) {

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
      }),
      retry(5)
    )
  }

  thumb(mapCfg: MapConfig): Observable<string> {
    let path = 'images/' + mapCfg.id + "_thumb"
    console.log(`Thumbnail for ${mapCfg.id}-${mapCfg.name} is ${path}`);
    const ref = this.storage.ref(path);
    return ref.getDownloadURL()
  }

  saveWithImage(item: MarkerType) {
    let f: File = item["__FILE"]

    this.storage.upload('images/' + item.id, f)
      .snapshotChanges()
      .subscribe(v => { }, e => { }, () => {
        this.saveMarkerTypeNoImage(item)
      })

  }

  saveMarkerTypeNoImage(item: MarkerType) {
    this.log.debug("saving")

    let toSave = LangUtil.clean(Object.assign({}, item))
    this.log.debug(toSave);

    this.db.object('markerTypes/' + item.id).set(toSave).then(() => {
      this.notify.success("Saved " + item.name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving Marker")
    })
  }

  saveMarkerType(item: MarkerType) {
    let f: File = item["__FILE"]
    if (f) {
      this.saveWithImage(item)
    } else {
      this.saveMarkerTypeNoImage(item)
    }
  }

  saveMarkerCategory(item: MarkerCategory) {
    let toSave = LangUtil.clean(Object.assign({}, item))
    this.log.debug(toSave);

    this.db.object('markerCategories/' + item.id).set(toSave).then(() => {
      this.notify.success("Saved " + item.name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving Group")
    })
  }

  saveUserGroup(item: UserGroup) {
    let toSave = LangUtil.clean(Object.assign({}, item))
    this.log.debug(toSave);

    this.db.object('groups/' + item.name).set(toSave).then(() => {
      this.notify.success("Saved " + item.name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving Group")
    })
  }

  saveMapType(item: MapType) {
    let toSave = LangUtil.clean(Object.assign({}, item))
    this.log.debug(toSave);
    this.db.object('mapTypes/' + item.id).set(toSave).then(() => {
      this.notify.success("Saved " + item.name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving Group")
    })
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
    let m = this.toMarkerType(markerType)
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
    let map = this.toMap(mapCfg)
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

  saveMap(map: MapConfig, image?: Blob, thumb?: Blob) {
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

  saveImageUrl(path: string, url: string): Observable<number> {
    const ref = this.storage.ref(path)
    let loadProgress = new Subject<number>()
    loadProgress.subscribe(this.notify.progress("Loading Image"))

    const task = ref.putString(url)
    task.percentageChanges().subscribe(loadProgress)

    return loadProgress
  }

  waitForComplete(obs: Observable<any>, fn: () => void) {
    obs.subscribe(
      onNext => { },
      onError => { },
      () => {
        fn()
      }
    )
  }

  private _saveMap(item: MapConfig) {
    let toSave = LangUtil.clean(Object.assign({}, item))
    this.log.debug(toSave);
    this.db.object('maps/' + item.id).set(toSave).then(() => {
      this.notify.success("Saved " + item.name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving Map")
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

    // return ref.put(data).percentageChanges()
  }

  deleteMapType(item: MapType) {
    this.db.object('mapTypes/' + item.id).remove().then(() => {
      this.notify.success("Removed " + item.name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Deleting Map")
    })
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

  deleteMarkerCategory(item: MarkerCategory | string) {
    let dbId = ''
    let name = 'Category'
    if (typeof (item) == 'string') {
      dbId = item
    } else {
      dbId = item.id
      name = item.name
    }

    this.db.object('markerCategories/' + dbId).remove().then(() => {
      this.notify.success("Removed " + name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Deleteing " + name)
    })

    this.storage.ref('images/' + dbId).delete()
  }

  deleteMarkerType(item: MarkerType | string) {
    let dbId = ''
    let name = 'Marker Type'
    if (typeof (item) == 'string') {
      dbId = item
    } else {
      dbId = item.id
      name = item.name
    }
    this.db.object('markerTypes/' + dbId).remove().then(() => {
      this.notify.success("Removed " + name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Deleteing " + name)
    })

    this.storage.ref('images/' + dbId).delete()
  }

  // Deletes the access id from all the things necessary
  completeUserGroupDelete(grp: UserGroup): any {
    this.db.list<User>(User.FOLDER).valueChanges().pipe(first()).subscribe(users => {
      users.forEach(u => {
        let id = this.remove(u.assumedGroups, grp.id)
        let name = this.remove(u.assumedGroups, grp.name)
        if (id || name) {
          this.save(this.toUser(u))
        }
      })
    })

    this.db.list<MapConfig>(MapConfig.FOLDER).valueChanges().pipe(first()).subscribe(items => {
      console.log("Checking on Maps");
      this.removeGroup(items, grp, this.toMap)
    })

    this.db.list<MapType>(MapType.FOLDER).valueChanges().pipe(first()).subscribe(items => {
      console.log("Checking on Map Type");
      this.removeGroup(items, grp, this.toMapType)
    })

    this.db.list<MarkerType>(MarkerType.FOLDER).valueChanges().pipe(first()).subscribe(items => {
      console.log("Checking on Marker Type");
      this.removeGroup(items, grp, this.toMarkerType)
    })

    this.db.list<MarkerType>(MarkerCategory.FOLDER).valueChanges().pipe(first()).subscribe(items => {
      console.log("Checking on Marker Category");
      this.removeGroup(items, grp, this.toMarkerCategory)
    })

    this.db.list<MapConfig>(MapConfig.FOLDER).valueChanges().pipe(
      first(),
      concatMap(m => m),
      tap(m => console.log("MAP ", m.id)),
      mergeMap(m => this.db.list<MarkerGroup>(MarkerGroup.FOLDER + "/" + m.id).valueChanges())
    ).subscribe(all => {
      console.log("Checking on Marker Group");
      this.removeGroup(all, grp, this.toMarkerGroup)
    })

    this.db.list<MapConfig>(MapConfig.FOLDER).valueChanges().pipe(
      first(),
      concatMap(m => m),
      tap(m => console.log("MAP ", m.id)),
      mergeMap(m => this.db.list<Annotation>(Annotation.FOLDER + "/" + m.id).valueChanges())
    ).subscribe(all => {
      console.log("Checking on Annotations");
      this.removeGroup(all, grp, this.toAnnotation)
    })

  }

  private removeGroup(items: any[], grp: UserGroup, convert: (a: any) => any) {
    items.forEach(raw => {
      let item = convert(raw)
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

  isRestricted(obj: any): boolean {
    if (obj.view && obj.view.length > 0) {
      return true
    }
    if (obj.edit && obj.edit.length > 0) {
      return true
    }
    return false
  }

  // User Functions
  canView(item: any): any {
    if (!item['view']) {
      return true
    }
    let view: Array<string> = item['view']
    if (view.length == 0) {
      return true
    }
    if (this.isReal) {
      return view.includes(this.user.getValue().uid) || this.arrayMatch(view, this.user.getValue().assumedGroups)
    }
    return false
  }

  canEdit(item: any): any {
    if (!item['edit']) {
      return true
    }
    let edit: Array<string> = item['edit']
    if (edit.length == 0) {
      return true
    }
    if (this.isReal) {
      return edit.includes(this.user.getValue().uid) || this.arrayMatch(edit, this.user.getValue().assumedGroups)
    }
    return false
  }

  isReal(): any {
    return this.user.getValue().uid != "NOBODY"
  }

  public saveRecentMarker(markerId: string) {
    if (this.isReal()) {
      let u = this.user.getValue()
      if (u.recentMarkers) {
        u.recentMarkers.unshift(markerId)
        if (u.recentMarkers.length > 5) {
          u.recentMarkers.splice(5, u.recentMarkers.length - 5)
        }
      } else {
        u.recentMarkers = [markerId]
      }
      this.save(u)
    }
  }

  public saveRecentMap(mapId: string) {
    this.log.debug("Saving Recent Map");

    if (this.isReal()) {
      let u = this.user.getValue()
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

  assignId(item: any) {
    if (!item.id) {
      item.id = UUID.UUID().toString()
    } else if (item.id == 'TEMP') {
      item.id = UUID.UUID().toString()
    }
  }

  private getUserInfo(u: User): Observable<User> {
    this.log.debug("Getting User Information for " + u.uid);
    if (u == null || u.uid == 'NOBODY') {
      return of(new User())
    }

    return this.db.object('users/' + u.uid)
      .snapshotChanges()
      .pipe(
        mergeMap(result => {
          if (result.payload.exists()) {
            this.log.debug("User Exists");

            this.log.debug(result.payload.val());
            let u = this.toUser(result.payload.val())
            return of(u)
          } else {
            this.log.debug("User doesn't exist");
            this.save(u)
            return of(u)
          }
        })
      )
  }


  restrictSummary(item: any): string {
    let viewUserNames = []
    let viewGroupNames = []
    let editUserNames = []
    let editGroupNames = []
    if (item.view) {
      item.view.forEach(i => {
        let match = this._users.find(u => u.uid == i)
        if (match) {
          viewUserNames.push(match.name)
        } else {
          viewGroupNames.push(i)
        }
      })
    }
    if (item.edit) {
      item.edit.forEach(i => {
        let match = this._users.find(u => u.uid == i)
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


  private myBuffer<T>(obs: Observable<T>, bufferSize): Observable<T[]> {
    let rtn = new ReplaySubject<T[]>()
    let items = new Array[bufferSize]()
    obs.subscribe(item => {
      items.push(item)
      if (items.length == bufferSize) {
        rtn.next(items)
        items = []
      }
    })
    return rtn;
  }

  private arrayMatch(arr1: string[], arr2: string[]): boolean {
    let result = false
    let matches = []
    if (arr1 && arr2) {
      arr1.forEach(arr1Item => {
        if (arr2.includes(arr1Item)) {
          result = true
        }
      })
    }
    return result
  }

}

export class BufferedSubscriber<T> {
  constructor() { }
  bufferSize: number
  items = []
  push(item: T) {
    this.items.push(item)
  }
  full(): boolean {
    return this.items.length >= this.bufferSize
  }
  empty(): T[] {
    let temp = this.items
    this.items = []
    return temp
  }
}


// export class Sequence {
//   all: Observable<any>[]
//   constructor(...obs: Observable<any>[]) {
//     this.all = obs
//   }

//   chain(obs : Observable<any>,next : Observable<any>) {
//     obs.subscribe(
//        onNext => {},
//        onError => {},
//        () => {
//         next.subscribe()
//        }
//     )
//   }

//   waitForComplete(obs : Observable<any>, fn:  ()=> void) {
//     obs.subscribe(
//        onNext => {},
//        onError => {},
//        () => {
//         fn()
//        }
//     )
//   }

//   run(fn: ()=> void) {
//     this.all.forEach( obs => {
//       this.waitForComplete(obs)
//     })
//   }
// }
