import { Injectable } from '@angular/core';
import { Marker, icon, IconOptions, marker, Icon, latLng } from 'leaflet';
import { UserService } from './user.service'
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { UUID } from 'angular2-uuid';
import { MapService } from './map.service';
import { mergeMap, scan, window, concatMap } from 'rxjs/operators';
import { DataService } from './data.service';
import { SavedMarker, MapConfig, MarkerType, MarkerCategory } from './models';


@Injectable({
  providedIn: 'root'
})
export class MarkerService {
 
  public selection = new ReplaySubject<Marker>()
  public updates = new ReplaySubject<Marker>()

  public markers = new ReplaySubject<Array<MyMarker>>()

  private types = new Map<string, MarkerType>()
  markerTypes = new Map<string, Icon>()
  categories = new Array<Category>()
  map : MapConfig
  catsLoaded = new ReplaySubject<boolean>()

  constructor(private usr: UserService, private db: AngularFireDatabase, private mapSvc : MapService, private data : DataService) {
    // Load the markers when the map changes
    this.mapSvc.mapConfig.pipe(
      mergeMap( newMap =>  {
          this.map = newMap
        return this.data.getMarkers(newMap.id)
      } )
    ).subscribe ( markers => {
      console.log("checking Markers " + markers.length);
      let localMarkers = new Array<MyMarker>()
      markers.forEach( marker => {
        if (this.usr.canView(marker)) {
          let m = this.fromSavedMarker(marker)
          localMarkers.push(m)
        }
      })
      console.log("Adding Marker " + localMarkers.length);
      this.markers.next(localMarkers)
    })

    // Load the Categories
    this.data.markerCategories.subscribe( cats => {
      let mycats = new Array<Category>()
      cats.forEach( cat => {
        let c = new Category()
        c.id = cat.id
        c.name = cat.name
        mycats.push(c)
      })
      this.categories = mycats
      this.catsLoaded.next(true)
    })

    // Load each of the icons
    this.catsLoaded.pipe(
      mergeMap( v => this.data.markerTypes),
      concatMap( items => {
        this.categories.forEach( c => {
          c.types = []
        })
        return items
      }),
      mergeMap( (value, index) => this.data.fillInUrl(value), 5)
    ).subscribe( markerType => {
      let icn =  icon({
        iconUrl: markerType.url,
        iconSize: markerType.iconSize,
        iconAnchor: markerType.iconAnchor
      })
      this.types.set(markerType.id, markerType)
      this.markerTypes.set(markerType.id, icn)
      let cat = this.categories.find( c=> c.name == markerType.category)
      if (cat) {
          cat.types.push(markerType)
      } else {
        console.log("No Cat found for " + markerType.category);
      }
    })
  }

  getMarkerType(id: string): MarkerType {
    return this.types.get(id)
  }

  update(me: Marker) {
    this.updates.next(me)
  }

  select(me: Marker) {
    this.selection.next(me)
  }

  public newMarker(select : boolean): MyMarker {
    var loc = this.mapSvc.getCenter()
    var icn = this.markerTypes.get("36ed0940-f3f0-496e-a452-e11c28bb3658")
    if (icn == undefined) {
      console.log("ERROR NO ICON");
    }
    var m = new MyMarker(marker(loc, { icon: icn, draggable: false }))
    m.id = UUID.UUID().toString()
    m.name = "New Marker"
    m.type = "36ed0940-f3f0-496e-a452-e11c28bb3658"
    m.map = this.map.id

    this.saveMarker(m)
    console.log(m);
    
    if (select) {
      this.select(m.marker)
    }

    return m
  }

  getMarkerTypes(): Map<string, Icon> {
    return this.markerTypes
  }

  saveMarker(m: MyMarker) {
    this.data.saveMarker(this.toSavedMarker(m))
    // this.markers.set(m.id, m);
    // this.markersObs.next([])
  }

  deleteMarker(m: MyMarker) {
    this.data.deleteMarker(m)
  }
 

  private i(name: string): Icon {
    return icon({
      iconUrl: "./assets/markers/" + name + ".png",
      shadowUrl: './assets/markers/shadow.png',
      iconSize: [43, 60],
      shadowSize: [50, 64],
      iconAnchor: [21, 60], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-3, -76]
    })
  }

  private makeSample() {
    var icn = this.markerTypes.get("Dragon - Red")
    var mk = marker([100, 1000], { icon: icn, draggable: true })
    var m = new MyMarker(mk)
    m.id = "sampe"
    m.name = "SAMPLE"
    m.type = "Dragon - Red"
    m.view = ["john"]
    m.edit = ["john"]

    this.saveMarker(m)
  }

  public toMyMarker(m: Marker): MyMarker {
    return new MyMarker(m)
  }

  public fromSavedMarker(saved : SavedMarker) : MyMarker {
  
    // Get the Icon
    let icn = this.markerTypes.get(saved.type)

    let loc = latLng(saved.location[0], saved.location[1])

    // Generate the marker 
    let mk = marker(loc, { icon: icn, draggable: false })

    let m = new MyMarker(mk)
    m.id = saved.id
    m.name = saved.name
    m.type = saved.type
    m.view = saved.view
    m.map =saved.map
    m.description = saved.description

    return m
  }

  public toSavedMarker(m : MyMarker) : SavedMarker {
    let location : [number, number] = [m.marker.getLatLng().lat,m.marker.getLatLng().lng]

    let saved = new SavedMarker()
    saved.id = m.id
    saved.name = m.name
    saved.description = m.description
    saved.location = location
    saved.type = m.type
    saved.edit = m.edit
    saved.view = m.view
    saved.map = m.map
    return saved
  }
}

export class MyMarker {

  constructor(public m: Marker) { }



  get marker(): Marker {
    return this.m;
  }
  get id(): string {
    return this.m["__id"]
  }
  set id(myId: string) {
    this.m["__id"] = myId
  }
  get name(): string {
    return this.m.options.title
  }
  set name(myName: string) {
    this.m.options.title = myName
  }
  get description(): string {
    return this.m["__description"]
  }
  set description(my: string) {
    this.m["__description"] = my
  }
  get type(): string {
    return this.m["__type"]
  }
  set type(my: string) {
    this.m["__type"] = my
  }
  get pageUrl(): string {
    return this.m["__pageUrl"]
  }
  set pageUrl(my: string) {
    this.m["__pageUrl"] = my
  }
  get view(): string[] {
    return this.m["__view"]
  }
  set view(my: string[]) {
    this.m["__view"] = my
  }
  get edit(): string[] {
    return this.m["__edit"]
  }
  set edit(my: string[]) {
    this.m["__edit"] = my
  }
  get x(): number {
    return this.m["__x"]
  }
  set x(my: number) {
    this.m["__x"] = my
  }
  get y(): number {
    return this.m["__y"]
  }
  set y(my: number) {
    this.m["__y"] = my
  }
  get maxZoom(): number {
    return this.m["__maxZoom"]
  }
  set maxZoom(my: number) {
    this.m["__maxZoom"] = my
  }
  get minZoom(): number {
    return this.m["__minZoom"]
  }
  set minZoom(my: number) {
    this.m["__minZoom"] = my
  }
  get map(): string {
    return this.m["__map"]
  }
  set map(id : string) {
    this.m["__map"] = id
  }
  get iconUrl() : string {
    // console.log("this.m " + this.m);
    // console.log("this.m.options" + this.m.options);
    // console.log("this.m.options.icon " + this.m.options.icon);
    // console.log("this.m.options.icon.options " + this.m.options.icon.options);
    // console.log("this.m.options.icon.options.iconUrl " + this.m.options.icon.options.iconUrl);
    return this.m.options.icon.options.iconUrl
  }
}


export class Permissions {
  view: string[]
  edit: string[]
}

class Category {
  name: string
  id : string
  types : MarkerType[] = []
}
