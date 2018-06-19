import { Injectable } from '@angular/core';
import { Marker, icon, IconOptions, marker, Icon } from 'leaflet';
import { UserService } from './user.service'
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { UUID } from 'angular2-uuid';
import { MapService } from './map.service';


@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  public selection = new ReplaySubject<Marker>()
  public updates = new ReplaySubject<Marker>()

  markers = new Map<string, MyMarker>()
  markersObs = new BehaviorSubject<MyMarker[]>([])
  markerTypes = new Map<string, Icon>()
  items: Observable<any[]>;

  constructor(private usr: UserService, private db: AngularFireDatabase, private mapSvc : MapService) {
    // this.usr.
    this.items = db.list('markers').valueChanges();
    this.items.subscribe(v => {
      v.forEach(item => {
        console.log('ITEMS');

        console.log(item);
      })
    })
    this.makeMarkers()
    // this.makeSample()
  }

  update(me: Marker) {
    this.updates.next(me)
  }

  select(me: Marker) {
    this.selection.next(me)
  }

  public newMarker(): MyMarker {
    var loc = this.mapSvc.getCenter()
    var icn = this.markerTypes.get("Dragon - Red")
    var m = new MyMarker(marker(loc, { icon: icn, draggable: false }))
    m.id = UUID.UUID().toString()
    m.name = "SAMPLE"
    m.type = "Dragon - Red"
    m.view = ["john"]
    m.edit = ["john"]

    this.saveMarker(m)
    return m
  }

  getMarkerTypes(): Map<string, Icon> {
    return this.markerTypes
  }

  saveMarker(m: MyMarker) {
    this.markers.set(m.id, m);
    this.markersObs.next([])
  }

  getViewableMarkers(user: string): Array<MyMarker> {
    var items = []

    this.markers.forEach((m) => {
      if (m.view.includes(user)) {
        items.push(m)
      }
    })

    return items
  }

  deleteMarker(m: MyMarker) {
    this.markers.delete(m.id)
    this.markersObs.next([])
  }

  exportMarkers() {

  }

  makeMarkers() {
    this.markerTypes.set("Dragon - Red", this.i("dragon_red"))
    this.markerTypes.set("Dragon - Blue", this.i("dragon_red"))
    this.markerTypes.set("Dragon - Green", this.i("dragon_red"))
    this.markerTypes.set("Dragon - Brass", this.i("dragon_red"))
    this.markerTypes.set("Dragon - Gold", this.i("dragon_red"))
    this.markerTypes.set("Dragon - Silver", this.i("dragon_red"))
    this.markerTypes.set("Dragon - Black", this.i("dragon_red"))

    this.markerTypes.set("Undead - Lich King", this.i("dragon_red"))
    this.markerTypes.set("Undead - Lieutenant", this.i("dragon_red"))
    this.markerTypes.set("Undead - Agent", this.i("dragon_red"))
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
}

export class ExportedMarker {
  id: string
  name: string
  description: string
  type: string
  pageUrl: string
  view: string[]
  edit: string[]
  lat: number;
  lng; number;
  zoomMin: number;
  zoomMax: number;
  marker: Marker
}


export class Permissions {
  view: string[]
  edit: string[]
}


