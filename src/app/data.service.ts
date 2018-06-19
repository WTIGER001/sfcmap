import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { MapType, MapConfig, UserGroup, MarkerCategory, MarkerType } from './models';
import { User } from './user.service';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { NotifyService } from './notify.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { mergeMap, map } from 'rxjs/operators';

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

  constructor(private db: AngularFireDatabase, private notify : NotifyService, private storage: AngularFireStorage) {
  
    this.loadAndNotify<MapType>(this.toMapType, this.mapTypes, 'mapTypes', 'Loading Map Types')
    this.loadAndNotify<MapConfig>(this.toMap, this.maps, 'maps', 'Loading Maps')
    this.loadAndNotify<User>(this.toUser, this.users, 'users', 'Loading Users')
    this.loadAndNotify<UserGroup>(this.toGroup, this.groups, 'groups', 'Loading User Groups')
    this.loadAndNotify<MarkerCategory>(this.toMarkerCategory, this.markerCategories, 'markerCategories', 'Loading Marker Categories')
    this.loadAndNotify<MarkerType>(this.toMarkerType, this.markerTypes, 'markerTypes', 'Loading Marker Types')
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

  private loadAndNotify<T>( convert: (a : any) => T, subject : ReplaySubject<Array<T>>, name : string, errorType : string) {
    console.log("Working on " + name);
    
    this.db.list(name).snapshotChanges().subscribe(
      inTypes => {
        let items = new Array<T>()
        inTypes.forEach(item => {
          let converted  = convert(item.payload.val())
          items.push(converted)
        })
        console.log("Loaded " + items.length + " " + name);
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

  thumb(mapCfg : MapConfig) : Observable<string> {
    let path = 'images/' + mapCfg.id + "_thumb.png"
    const ref = this.storage.ref(path);
    return ref.getDownloadURL()
  }
}
