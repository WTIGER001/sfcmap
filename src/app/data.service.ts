import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, zip, range, combineLatest, forkJoin, BehaviorSubject, of } from 'rxjs';
import { MapType, MapConfig, UserGroup, MarkerCategory, MarkerType, SavedMarker, MergedMapType, User, IObjectType, MarkerGroup, UserPreferences } from './models';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { NotifyService, Debugger } from './notify.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { mergeMap, map, concatMap, bufferCount } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  ready = new ReplaySubject<boolean>()

  // The currently logged in user
  user = new BehaviorSubject<User>(new User())
  userPrefs = new BehaviorSubject<UserPreferences>(new UserPreferences())

  mapTypes = new ReplaySubject<Array<MapType>>()
  maps = new ReplaySubject<Array<MapConfig>>()
  users = new ReplaySubject<Array<User>>()
  groups = new ReplaySubject<Array<UserGroup>>()
  markerCategories = new ReplaySubject<Array<MarkerCategory>>()
  markerTypes = new ReplaySubject<Array<MarkerType>>()
  mapsWithUrls = new ReplaySubject<Array<MarkerType>>()
  mapTypesWithMaps = new ReplaySubject<Array<MergedMapType>>()

  log: Debugger

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private notify: NotifyService, private storage: AngularFireStorage) {
    this.log = this.notify.newDebugger("Data")

    afAuth.authState
      .pipe(
        map(fireUser => User.fromFireUser(fireUser)),
        mergeMap(u => this.getUserInfo(u))
      )
      .subscribe(u => {
        this.log.info(`User Logged in ${u.uid}`, u)
        this.user.next(u)
      });

    this.user.pipe(
      mergeMap(u => this.getUserPrefs(u))
    ).subscribe(
      prefs => this.userPrefs.next(prefs)
    )

    this.loadAndNotify<MapType>(this.toMapType, this.mapTypes, 'mapTypes', 'Loading Map Types')
    this.loadAndNotify<MapConfig>(this.toMap, this.maps, 'maps', 'Loading Maps')
    this.loadAndNotify<User>(this.toUser, this.users, 'users', 'Loading Users')
    this.loadAndNotify<UserGroup>(this.toGroup, this.groups, 'groups', 'Loading User Groups')
    this.loadAndNotify<MarkerCategory>(this.toMarkerCategory, this.markerCategories, 'markerCategories', 'Loading Marker Categories')
    this.loadAndNotify<MarkerType>(this.toMarkerType, this.markerTypes, 'markerTypes', 'Loading Marker Types')

    // Load the URLS
    this.maps.pipe(
      concatMap(i => i),
      mergeMap(m => this.fillInMapUrl(m)),
      mergeMap(m => this.fillInMapThumb(m))
    ).subscribe(a => {

    })

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
      })

    combineLatest(this.user, this.maps, this.mapTypes, this.markerTypes, this.markerCategories)
      .subscribe(() => {
        this.ready.next(true)
      })
  }

  getMarkers(mapid: string): Observable<Array<SavedMarker>> {
    return this.db.list('markers/' + mapid)
      .snapshotChanges()
      .pipe(
        map(items => {
          let markers = new Array<SavedMarker>()
          items.forEach(m => {
            markers.push(<SavedMarker>m.payload.val())
          })
          return markers;
        })
      )
  }

  getMarkerGroups(mapid: string): Observable<Array<MarkerGroup>> {
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


  toObject(item: IObjectType): MarkerGroup | UserGroup | UserPreferences {
    if (MarkerGroup.is(item)) { return item }
    if (UserGroup.is(item)) { return item }
    if (UserPreferences.is(item)) { return item }
  }

  dbPath(item: IObjectType): string {
    if (MarkerGroup.is(item)) { return MarkerGroup.dbPath(item) }
    if (UserGroup.is(item)) { return 'groups/' + item.name }
    if (UserPreferences.is(item)) { return UserPreferences.dbPath(item) }
  }

  sample(item: IObjectType): any {
    if (MarkerGroup.is(item)) { return MarkerGroup.SAMPLE }
    if (UserGroup.is(item)) { return UserGroup.SAMPLE }
    if (UserPreferences.is(item)) { return UserPreferences.SAMPLE }

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

  private toUserPreferences(item: any): UserPreferences {
    let me = new UserPreferences()
    Object.assign(me, item)
    return me
  }

  private loadAndNotify<T>(convert: (a: any) => T, subject: ReplaySubject<Array<T>>, name: string, errorType: string, sorter?: (items: Array<T>) => void) {
    this.log.debug('Loading ' + name)

    this.db.list(name).snapshotChanges().subscribe(
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

  saveUser(item: User) {
    let toSave = this.clean(Object.assign({}, item))
    this.log.debug(toSave);

    this.db.object('users/' + item.uid).set(toSave).then(() => {
      this.notify.success("Saved " + item.name)
    }).catch(reason => {
      this.notify.showError(reason, "Error Saving User")
    })
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
      return view.includes(this.user.getValue().uid)
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
      return edit.includes(this.user.getValue().uid)
    }
    return false
  }

  isReal(): any {
    return this.user.getValue().uid != "NOBODY"
  }

  public saveRecentMarker(markerId: string) {
    if (this.isReal()) {
      let u = this.userPrefs.getValue()
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
      let u = this.userPrefs.getValue()
      this.log.debug("Found User Prefs");

      if (u.recentMaps) {
        let recent = u.recentMaps.filter(item => item != mapId)
        recent.unshift(mapId)
        if (recent.length > 5) {
          recent.splice(5, recent.length - 5)
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

    return this.db.object('users/' + u.uid)
      .snapshotChanges()
      .pipe(
        mergeMap(result => {
          if (result.payload.exists()) {
            this.log.debug("User Exists");

            this.log.debug(result.payload.val());
            var newUser: User = <User>result.payload.val()
            return of(newUser)
          } else {
            this.log.debug("User DOESNT ");
            this.saveUser(u)
            return of(u)
          }
        })
      )
  }

  private getUserPrefs(u: User): Observable<UserPreferences> {
    this.log.debug("Getting User Preferences for " + u.uid);
    return this.db.object(UserPreferences.pathTo(u.uid))
      .snapshotChanges()
      .pipe(
        mergeMap(result => {
          if (result.payload.exists()) {
            this.log.debug("User PRefes Exist");
            let prefs = this.toUserPreferences(<UserPreferences>result.payload.val())
            this.log.debug(prefs)
            return of(prefs)
          } else {
            this.log.debug("NO User PRefes Exist");

            let newPrefs = new UserPreferences();
            newPrefs.uid = u.uid
            this.save(newPrefs)
            this.log.debug(newPrefs)
            return of(newPrefs)
          }
        })
      )
  }
}
