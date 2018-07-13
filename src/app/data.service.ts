import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, zip, range, combineLatest, forkJoin, BehaviorSubject, of, interval, Subscription } from 'rxjs';
import { MapType, MapConfig, UserGroup, MarkerCategory, MarkerType, SavedMarker, MergedMapType, User, IObjectType, MarkerGroup, Category } from './models';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { NotifyService, Debugger } from './notify.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { mergeMap, map, concatMap, bufferCount, tap } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { User as FireUser } from 'firebase';


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
  markersWithUrls = new ReplaySubject<Array<MarkerType>>()
  mapsWithUrls = new ReplaySubject<Array<MapConfig>>()
  mapTypesWithMaps = new ReplaySubject<Array<MergedMapType>>()
  categories = new ReplaySubject<Array<Category>>()

  log: Debugger

  subs: Subscription[] = []

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private notify: NotifyService, private storage: AngularFireStorage) {
    this.log = this.notify.newDebugger("Data")

    // Subscribe to the firebase user. This can be null or a firebase user. When we get a user or a null value we reload all the data
    afAuth.user.subscribe(fireUser => {
      let user = User.fromFireUser(fireUser)
      this.onLogon(user)
    })

    // Load the URLS for map
    let mapBuffer = new BufferedSubscriber<MapConfig>()
    this.maps.pipe(
      map(i => {
        mapBuffer.bufferSize = i.length;
        return i
      }),
      concatMap(i => i),
      mergeMap(m => this.fillInMapUrl(m), 5),
      mergeMap(m => this.fillInMapThumb(m), 5)
    ).subscribe(item => {
      mapBuffer.push(item)
      if (mapBuffer.full()) {
        let items = mapBuffer.empty()
        this.log.debug(`Loaded URLS for all maps ... ${items.length}`)
        this.mapsWithUrls.next(items)
      }
    })

    // Load the URLS for the markers
    let markerBuffer = new BufferedSubscriber<MarkerType>()
    this.markerTypes.pipe(
      map(i => {
        this.log.debug(`Loading URLS for all Markers .. Step 1... ${i.length}`)
        markerBuffer.bufferSize = i.length;
        return i
      }),
      concatMap(i => i),
      mergeMap(m => this.fillInUrl(m), 5)
      // bufferCount(markerCount[0])
    ).subscribe(item => {
      markerBuffer.push(item)
      if (markerBuffer.full()) {
        let items = markerBuffer.empty()
        this.log.debug(`Loaded URLS for all Markers ... ${items.length}`)
        this.markersWithUrls.next(items)
      }
    })

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

  getMarkers(mapid: string): Observable<Array<SavedMarker>> {
    return this.db.list('markers/' + mapid)
      .snapshotChanges()
      .pipe(
        map(items => {
          let markers = new Array<SavedMarker>()
          items.forEach(m => {
            let saved = <SavedMarker>m.payload.val()
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
          let markers = new Array<MarkerGroup>()
          items.forEach(m => {
            markers.push(this.toMarkerGroup(m.payload.val()))
          })
          return markers;
        })
      )
  }

  getCompleteMarkerGroups(mapid: string): Observable<Array<MarkerGroup>> {
    let myMarkerObs = this.user.pipe(
      mergeMap(pref => this.getMarkers(mapid))
    )

    return combineLatest(this.markersWithUrls, this.getMarkerGroups(mapid), myMarkerObs).pipe(
      map(value => {
        this.log.debug(`Loading Complete Marker Groups for ${mapid} with ${value[1].length} Groups`)
        let markerTypes = value[0]
        let groups = value[1]
        let markers = value[2]

        groups.forEach(grp => {
          grp.markers = markers.filter(m => m.markerGroup == grp.id)
        })
        let uncat = new MarkerGroup()
        uncat.id = DataService.UNCATEGORIZED
        uncat.name = "Ungrouped"
        uncat.markers = markers.filter(m => (!m.markerGroup || m.markerGroup == ''))
        if (uncat.markers.length > 0) {
          groups.push(uncat)
        }
        return groups
      })
    )
  }

  toObject(item: IObjectType): MarkerGroup | UserGroup | User {
    if (MarkerGroup.is(item)) { return item }
    if (UserGroup.is(item)) { return item }
    if (User.is(item)) { return item }
  }

  dbPath(item: IObjectType): string {
    if (MarkerGroup.is(item)) { return MarkerGroup.dbPath(item) }
    if (UserGroup.is(item)) { return 'groups/' + item.name }
    if (User.is(item)) { return User.dbPath(item) }
  }

  sample(item: IObjectType): any {
    if (MarkerGroup.is(item)) { return MarkerGroup.SAMPLE }
    if (UserGroup.is(item)) { return UserGroup.SAMPLE }
    if (User.is(item)) { return User.SAMPLE }

  }

  save(item: IObjectType) {
    // Copy the Item so we only save a normal javascript object, and remove all the bad
    let toSave = this.clean(Object.assign({}, item))
    // Remove the fields that are not part of the object that should be saved in the database
    this.trimExtraneousFields(toSave, this.sample(item))

    // Get path to the object
    let path = this.dbPath(item)
    this.log.info('Saving Item ', toSave)

    this.db.object(path).set(toSave).then(() => {
      // this.notify.success("Saved " + path)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving " + path)
    })
  }

  delete(item: IObjectType) {
    let path = this.dbPath(item)
    this.db.object(path).remove().then(() => {
      this.notify.success("Removed ")
    }).catch(reason => {
      this.notify.showError(reason, "Error Deleting Map")
    })
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
    // let me = new UserGroup()
    // Object.assign(me, item)
    return <UserGroup>item
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
          items.push(converted)
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
    const ref = this.storage.ref(path);
    return ref.getDownloadURL().pipe(
      map(item => {
        return item
      })
    )
  }

  fillInUrl(item: MarkerType): Observable<MarkerType> {
    let path = 'images/' + item.id
    const ref = this.storage.ref(path);
    return ref.getDownloadURL().pipe(
      map(url => {
        item.url = url
        return item
      })
    )
  }

  loadMapUrls(maps: MapConfig[]) {

  }

  fillInMapUrl(item: MapConfig): Observable<MapConfig> {
    let path = 'images/' + item.id
    const ref = this.storage.ref(path);
    return ref.getDownloadURL().pipe(
      map(url => {
        item.image = url
        return item
      })
    )
  }

  fillInMapThumb(item: MapConfig): Observable<MapConfig> {
    return this.thumb(item).pipe(
      map(url => {
        item.thumb = url
        return item
      })
    )
  }


  thumb(mapCfg: MapConfig): Observable<string> {
    let path = 'images/' + mapCfg.id + "_thumb"
    const ref = this.storage.ref(path);
    return ref.getDownloadURL()
  }

  saveMarker(item: SavedMarker) {
    // Convert the Saved Marker into a regular object
    let toSave = this.clean(Object.assign({}, item))
    this.log.debug(toSave);

    this.db.object('markers/' + item.map + "/" + item.id).set(toSave).then(() => {
      this.log.debug("Saved a Marker ", toSave)
      this.notify.success("Saved " + item.name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving Marker")
    })
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

    let toSave = this.clean(Object.assign({}, item))
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
    let toSave = this.clean(Object.assign({}, item))
    this.log.debug(toSave);

    this.db.object('markerCategories/' + item.id).set(toSave).then(() => {
      this.notify.success("Saved " + item.name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving Group")
    })
  }

  saveUserGroup(item: UserGroup) {
    let toSave = this.clean(Object.assign({}, item))
    this.log.debug(toSave);

    this.db.object('groups/' + item.name).set(toSave).then(() => {
      this.notify.success("Saved " + item.name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving Group")
    })
  }

  saveMapType(item: MapType) {
    let toSave = this.clean(Object.assign({}, item))
    this.log.debug(toSave);
    this.db.object('mapTypes/' + item.id).set(toSave).then(() => {
      this.notify.success("Saved " + item.name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving Group")
    })
  }

  saveMap(map: MapConfig, image?: Blob, thumb?: Blob) {
    this.log.debug("Saving Map a");
    if (thumb && image) {
      this.log.debug("Saving Map b");

      let pathImage = 'images/' + map.id
      let pathThumb = 'images/' + map.id + "_thumb"

      let obsImage = this.saveImage(image, pathImage)
      let obsThumb = this.saveImage(thumb, pathThumb)

      // Wait for the images to be uploaded
      forkJoin(obsImage, obsThumb).subscribe(results => {

        this._saveMap(map)
      }, err => {
        this.log.debug("ERROR");
        this.log.debug(err);
      }, () => {
        this.log.debug("Complete");
      })

    } else {
      this._saveMap(map)
    }
  }

  private _saveMap(item: MapConfig) {
    let toSave = this.clean(Object.assign({}, item))
    this.log.debug(toSave);
    this.db.object('maps/' + item.id).set(toSave).then(() => {
      this.notify.success("Saved " + item.name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving Map")
    })
  }

  saveImage(data: Blob, path: string) {
    this.log.debug("Saving Map Blob " + path);

    const ref = this.storage.ref(path)
    return ref.put(data)
      .snapshotChanges()
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

  deleteMarker(item: SavedMarker) {
    this.db.object('markers/' + item.map + "/" + item.id).remove().then(() => {
      this.notify.success("Removed " + item.name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving Marker")
    })
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

  deleteUserGroup(item: UserGroup): any {
    this.db.object('groups/' + item.name).remove().then(() => {
      this.notify.success("Removed " + name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Deleteing " + name)
    })
  }

  clean(obj): any {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj
  }

  trimExtraneousFields(obj: any, sample: any) {
    if (sample) {
      let fields = new Map<string, boolean>()
      for (var propName in sample) {
        fields.set(propName, true)
      }
      for (var propName in obj) {
        if (!fields.has(propName)) {
          delete obj[propName];
        }
      }
    }
  }

  copyData(dest: any, src: any, sample: any) {
    for (var propName in sample) {
      dest[propName] = src[propName]
    }
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
