import { Injectable } from '@angular/core';
import { Marker, icon, IconOptions, marker, Icon, latLng } from 'leaflet';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { UUID } from 'angular2-uuid';
import { MapService } from './map.service';
import { mergeMap, scan, window, concatMap } from 'rxjs/operators';
import { DataService } from './data.service';
import { SavedMarker, MapConfig, MarkerType, MarkerCategory, MapType } from './models';


@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  mapTypes : MapType[]
  public selection = new ReplaySubject<Marker>()
  public updates = new ReplaySubject<Marker>()

  public markers = new ReplaySubject<Array<MyMarker>>()

  private types = new Map<string, MarkerType>()
  markerTypes = new Map<string, Icon>()
  categories = new Array<Category>()
  map : MapConfig
  catsLoaded = new ReplaySubject<boolean>()
  defaultMarker : string

  constructor(private db: AngularFireDatabase, private mapSvc : MapService, private data : DataService) {
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
        if (this.data.canView(marker)) {
          let m = this.fromSavedMarker(marker)
          if (m) {
            localMarkers.push(m)
          }
        } else {
          console.log("Cannot View... skipping");
        }
      })
      console.log("Adding Marker " + localMarkers.length);
      this.markers.next(localMarkers)
    })

    this.data.mapTypes.subscribe( t => this.mapTypes = t)

    // Load the Categories
    this.data.markerCategories.subscribe( cats => {
      let mycats = new Array<Category>()
      cats.forEach( cat => {
        let c = new Category()
        c.id = cat.id
        c.name = cat.name
        c.appliesTo = cat.appliesTo
        mycats.push(c)
      })
      this.categories = mycats
      this.catsLoaded.next(true)
    })

    // Load each of the icons
    this.catsLoaded.pipe(
      mergeMap( v => {
        this.defaultMarker = undefined
        return this.data.markerTypes
      }),
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
        // shadowUrl: markerType.url,
        // shadowSize: markerType.iconSize,
        // shadowAnchor: [0,0]
      })
      this.types.set(markerType.id, markerType)
      this.markerTypes.set(markerType.id, icn)
      let cat = this.categories.find( c=> c.id == markerType.category)
      if (cat) {
          cat.types.push(markerType)
      } else {
        console.log("No Cat found for " + markerType.category);
      }
      if (this.defaultMarker == undefined) {
        this.defaultMarker = markerType.id
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

  public newTempMarker(): MyMarker {
    let markerTypeId = this.getDefaultMarker(this.map) 
    var loc = this.mapSvc.getCenter()
    var icn = this.markerTypes.get(markerTypeId)
    if (icn == undefined) {
      console.log("ERROR NO ICON");
    }
    var m = new MyMarker(marker(loc, { icon: icn, draggable: false }))
    m.id = UUID.UUID().toString()
    m.name = "New Marker"
    m.type = markerTypeId
    m.map = this.map.id

    return m
  }

  public newMarker(select : boolean): MyMarker {
    let m = this.newTempMarker()
    
    this.saveMarker(m)
    console.log(m);
    
    if (select) {
      m.selected = true
      this.select(m.marker)
    }

    return m
  }

  getDefaultMarker(item : MapConfig) : string {
    if (item.defaultMarker) {
      return item.defaultMarker
    }
    
    let mt = this.mapTypes.find(mt => mt.id == item.mapType)
    if (mt && mt.defaultMarker) {
      return mt.defaultMarker
    }

    return this.defaultMarker
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
    if (icn == undefined) {
      console.log("Cannot find Maerk Type with id of " + saved.type);
      return undefined
    }

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
  public static readonly TYPE = "markers.MyMarker";
  objType = MyMarker.TYPE;

  static is(obj: any): obj is MyMarker {
      return obj.objType && obj.objType == MyMarker.TYPE
  }

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
  get selected(): boolean {
    return this.m["__selected"]
  }
  set selected(id : boolean) {
    this.m["__selected"] = id
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
  appliesTo: string[];
  name: string
  id : string
  types : MarkerType[] = []
}
