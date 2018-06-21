import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, zip, range, combineLatest } from 'rxjs';
import { MapType, MapConfig, UserGroup, MarkerCategory, MarkerType, SavedMarker, MergedMapType } from './models';
import { User, UserService } from './user.service';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { NotifyService } from './notify.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { mergeMap, map, concatMap, bufferCount } from 'rxjs/operators';
import { MyMarker } from './marker.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  mapTypes = new ReplaySubject<Array<MapType>>()
  maps = new ReplaySubject<Array<MapConfig>>()
  users = new ReplaySubject<Array<User>>()
  groups = new ReplaySubject<Array<UserGroup>>()
  markerCategories = new ReplaySubject<Array<MarkerCategory>>()
  markerTypes = new ReplaySubject<Array<MarkerType>>()
  mapsWithUrls = new  ReplaySubject<Array<MarkerType>>()
  mapTypesWithMaps = new ReplaySubject<Array<MergedMapType>>()

  constructor(private db: AngularFireDatabase, private notify : NotifyService, private storage: AngularFireStorage, private usrSvc : UserService) {
  
    this.loadAndNotify<MapType>(this.toMapType, this.mapTypes, 'mapTypes', 'Loading Map Types')
    this.loadAndNotify<MapConfig>(this.toMap, this.maps, 'maps', 'Loading Maps')
    this.loadAndNotify<User>(this.toUser, this.users, 'users', 'Loading Users')
    this.loadAndNotify<UserGroup>(this.toGroup, this.groups, 'groups', 'Loading User Groups')
    this.loadAndNotify<MarkerCategory>(this.toMarkerCategory, this.markerCategories, 'markerCategories', 'Loading Marker Categories')
    this.loadAndNotify<MarkerType>(this.toMarkerType, this.markerTypes, 'markerTypes', 'Loading Marker Types')
    
    this.maps.pipe(
      concatMap( i => i),
      mergeMap( m => this.fillInMapUrl(m))
    ).subscribe( a => {
      console.log("Running");
    })

    combineLatest(this.mapTypes, this.maps)
    .subscribe(([mts, mps]) => {
      console.log("Mergin");
      
      let mergedArr = new Array<MergedMapType>()
      mts.forEach( mt => {
        let merged = new MergedMapType()
        merged.name = mt.name
        merged.order = mt.order
        merged.maps = mps.filter( m => m.mapType == merged.name && this.usrSvc.canView(m))
        mergedArr.push(merged)
      })
      let items = mergedArr.sort((a, b) => b.order-a.order) 
      this.mapTypesWithMaps.next(items)
    })
  }

  getMarkers(mapid: string): Observable<Array<SavedMarker>> {
    return this.db.list('markers/' + mapid)
    .snapshotChanges()
    .pipe(
      map(items => {
        let markers = new Array<SavedMarker>()
        items.forEach( m => {
          console.log();
          markers.push(<SavedMarker>m.payload.val())
          console.log(markers.length);
        })
        return markers;
      })
    )
  }

  canView(item: any): any {
    throw new Error("Method not implemented.");
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

  private loadAndNotify<T>( convert: (a : any) => T, subject : ReplaySubject<Array<T>>, name : string, errorType : string, sorter?: (items : Array<T>) => void) {
    console.log("Working on " + name);
    
    this.db.list(name).snapshotChanges().subscribe(
      inTypes => {
        let items = new Array<T>()
        inTypes.forEach(item => {
          let converted  = convert(item.payload.val())
          items.push(converted)
        })
        console.log("Loaded " + items.length + " " + name);
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
    console.log("Getting Download URL for " + item.name);
    let path = 'images/' + item.id + ".jpg"
    const ref = this.storage.ref(path);
    return ref.getDownloadURL().pipe(
      map( item => {
        console.log("DONE:  " + item);
        return item
      })
    )
  }

  fillInUrl(item : MarkerType) : Observable<MarkerType> {
    let path = 'images/' + item.id + ".png"
    const ref = this.storage.ref(path);
    return ref.getDownloadURL().pipe(
      map( url => {
        item.url = url
        return item
      })
    )
  }

  fillInMapUrl(item : MapConfig) : Observable<MapConfig> {
    let path = 'images/' + item.id + ".jpg"
    const ref = this.storage.ref(path);
    return ref.getDownloadURL().pipe(
      map( url => {
        item.image = url
        return item
      })
    )
  }


  thumb(mapCfg : MapConfig) : Observable<string> {
    let path = 'images/' + mapCfg.id + "_thumb.png"
    const ref = this.storage.ref(path);
    return ref.getDownloadURL()
  }

  
  saveMarker(item: SavedMarker ) {
    // Convert the Saved Marker into a regular object
    let toSave = this.clean(Object.assign({}, item))
    console.log(toSave);
    

    this.db.object('markers/' + item.map + "/" + item.id).set(toSave).then( () => {
      this.notify.success("Saved " + item.name)
    }).catch( reason => {
      this.notify.showError(reason, "Error Saving Marker")
    })
  }


  saveWithImage(item: MarkerType) {
    let f : File = item["__FILE"]
    this.storage.upload('images/' + item.id + ".png", f)
    .snapshotChanges()
    .subscribe( v => {}, e => {}, () => {
      this.saveMarkerTypeNoImage(item)
    })

  }

  saveMarkerTypeNoImage(item: MarkerType) {
    console.log("saving")

    let toSave = this.clean(Object.assign({}, item))
    console.log(toSave);
    
    this.db.object('markerTypes/' + item.id).set(toSave).then( () => {
      this.notify.success("Saved " + item.name)
    }).catch( reason => {
      this.notify.showError(reason, "Error Saving Marker")
    })
  }

  saveMarkerType(item: MarkerType) {
    let f : File = item["__FILE"]
    if (f ) {
      this.saveWithImage(item)
    } else {
      this.saveMarkerTypeNoImage(item)
    }
  }

  saveMarkerCategory(arg0: any): any {
    throw new Error("Method not implemented.");
  }

  saveUserGroup(item: UserGroup) {
    let toSave = this.clean(Object.assign({}, item))
    console.log(toSave);
    
    this.db.object('groups/' + item.name).set(toSave).then( () => {
      this.notify.success("Saved " + item.name)
    }).catch( reason => {
      this.notify.showError(reason, "Error Saving Group")
    })
  }

  deleteMarker(item: SavedMarker | MyMarker) {
    this.db.object('markers/' + item.map + "/" + item.id).remove().then( () => {
      this.notify.success("Removed " + item.name)
    }).catch( reason => {
      this.notify.showError(reason, "Error Saving Marker")
    })
  }

  deleteMarkerCategory(item: MarkerCategory | string) {
    let dbId = ''
    let name = 'Category'
    if  (typeof(item) == 'string') {
      dbId = item
    } else {
      dbId = item.id
      name = item.name
    }

    this.db.object('markerCategories/' + dbId).remove().then( () => {
      this.notify.success("Removed " + name)
    }).catch( reason => {
      this.notify.showError(reason, "Error Deleteing " + name)
    })
  }

  deleteMarkerType(item: MarkerType | string) {
    let dbId = ''
    let name = 'Marker Type'
    if  (typeof(item) == 'string') {
      dbId = item
    } else {
      dbId = item.id
      name = item.name
    }
    this.db.object('markerTypes/' + dbId).remove().then( () => {
      this.notify.success("Removed " + name)
    }).catch( reason => {
      this.notify.showError(reason, "Error Deleteing " + name)
    })
  }

  deleteUserGroup(item: UserGroup): any {
    this.db.object('groups/' + item.name).remove().then( () => {
      this.notify.success("Removed " + name)
    }).catch( reason => {
      this.notify.showError(reason, "Error Deleteing " + name)
    })
  }

  clean(obj) : any {
    for (var propName in obj) { 
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj
  }
}
