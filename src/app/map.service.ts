import { Injectable, NgZone } from '@angular/core';
import { ReplaySubject, combineLatest } from 'rxjs';
import { Map as LeafletMap, LatLng, Layer, LayerGroup, Marker, layerGroup, icon, IconOptions, marker, Icon, latLng } from 'leaflet';
import { MapConfig, Selection, MarkerGroup, SavedMarker, MarkerType, MapType, UserPreferences } from './models';
import { DataService } from './data.service';
import { mergeMap, concatMap, map } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public static readonly UNCATEGORIZED = "UNGROUPED"

  // Observables
  public selection = new ReplaySubject<Selection>()
  public markerReady = new ReplaySubject<MyMarker>()
  public markerRemove = new ReplaySubject<MyMarker>()
  // public selection = new ReplaySubject<Marker>()
  public updates = new ReplaySubject<Marker>()

  // Core Data
  map = new ReplaySubject<LeafletMap>()
  mapConfig = new ReplaySubject<MapConfig>()
  prefs: UserPreferences

  maps: MapConfig[] = []
  _map: LeafletMap
  _mapCfg: MapConfig
  groups: MarkerGroup[] = []
  markers: SavedMarker[] = []
  mapTypes: MapType[]
  myMarkers = new Map<string, MyMarker>()
  myMarks: MyMarker[] = []
  public markersObs = new ReplaySubject<Array<MyMarker>>()
  private types = new Map<string, MarkerType>()

  // Layers
  layers: Layer[];
  newMarkersLayer: LayerGroup;
  allMarkersLayer: LayerGroup;
  lGroups = new Map<string, LayerGroup>()

  categories = new Array<Category>()
  defaultMarker: string
  markerTypes = new Map<string, Icon>()
  catsLoaded = new ReplaySubject<boolean>()

  constructor(private zone: NgZone, private data: DataService) {
    this.allMarkersLayer = layerGroup()
    this.newMarkersLayer = layerGroup()

    this.data.maps.subscribe(
      maps => this.maps = maps
    )

    let prefsObs = this.data.userPrefs.pipe(
      map(prefs => this.prefs = prefs),
      map(prefs => {
        if (!this._mapCfg) {
          if (prefs.recentMaps && prefs.recentMaps.length > 0) {
            let mapId = prefs.recentMaps[0]
            let mapConfig = this.maps.find(m => m.id == mapId)
            if (mapConfig) {
              this.setConfig(mapConfig)
            }
          }
        }
      })
    )

    // Load the Map Types
    this.data.mapTypes.subscribe(t => this.mapTypes = t)

    // Load the Categories
    this.data.markerCategories.subscribe(cats => {
      let mycats = new Array<Category>()
      cats.forEach(cat => {
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
      mergeMap(v => {
        this.defaultMarker = undefined
        return this.data.markerTypes
      }),
      concatMap(items => {
        this.categories.forEach(c => {
          c.types = []
        })
        return items
      }),
      mergeMap((value, index) => this.data.fillInUrl(value), 5)
    ).subscribe(markerType => {
      let icn = icon({
        iconUrl: markerType.url,
        iconSize: markerType.iconSize,
        iconAnchor: markerType.iconAnchor
      })
      this.types.set(markerType.id, markerType)
      this.markerTypes.set(markerType.id, icn)
      let cat = this.categories.find(c => c.id == markerType.category)
      if (cat) {
        cat.types.push(markerType)
      } else {
        console.log("No Cat found for " + markerType.category);
      }
      if (this.defaultMarker == undefined) {
        this.defaultMarker = markerType.id
      }
    })

    let mapMarkerGroupsObs = this.mapConfig
      .pipe(
        map(mapCfg => this._mapCfg = mapCfg),
        mergeMap(newMap => this.data.getMarkerGroups(newMap.id)),
        mergeMap(mgs => {
          this.groups = mgs

          // Make LayerGroups
          this.makeLayerGroups(mgs);
          return this.data.getMarkers(this._mapCfg.id)
        }),
        map(markers => {
          console.log("checking Markers " + markers.length);
          this.markers = markers
          let localMarkers = new Array<MyMarker>()
          markers.forEach(marker => {
            if (this.data.canView(marker)) {
              let m = this.fromSavedMarker(marker)
              if (m) {
                localMarkers.push(m)
              }
            }
          })
          this.myMarks = localMarkers
          this.markersObs.next(localMarkers)
        })
      )

    combineLatest(prefsObs, mapMarkerGroupsObs)
      .subscribe(() => {
        console.log("BUILDING LAYERS");
        this.allMarkersLayer.clearLayers()

        // Loop through the groups. Add each group to the map
        this.groups.forEach(g => {
          this.addGroup(g.id)
        })
        this.addGroup(MapService.UNCATEGORIZED)

        // Loop through the markers. Add each marker to the group layer
        // 
        this.myMarks.forEach(mm => {
          if (!this.prefs.isHiddenMarker(this._mapCfg.id, mm.id)) {
            if (mm.markerGroup) {
              let g = this.lGroups.get(mm.markerGroup)
              this.addEventListeners(mm)
              mm.marker.addTo(g)
            } else {
              let g = this.lGroups.get(MapService.UNCATEGORIZED)
              this.addEventListeners(mm)
              mm.marker.addTo(g)
            }
          }
        })
      })
  }

  private addGroup(groupId: string) {
    if (!this.prefs.isHiddenGroup(this._mapCfg.id, groupId)) {
      let lGroup = this.lGroups.get(groupId)
      if (lGroup) {
        lGroup.clearLayers()
        lGroup.addTo(this.allMarkersLayer)
      }
    }
  }


  private addEventListeners(m: MyMarker) {
    m.marker.addEventListener('click', event => {
      this.zone.run(() => {
        var m = <Marker>event.target
        let marker = new MyMarker(m)
        marker.selected = true
        this.select(new MyMarker(m))
      });
    })
    m.marker.on('add', event => {
      this.zone.run(() => {
        this.markerAdded(m)
      })
    })
    m.marker.on('remove', event => {
      this.zone.run(() => {
        this.markerRemoved(m)
      })
    })
  }

  private makeLayerGroups(mgs: MarkerGroup[]) {
    this.lGroups.clear();
    this.lGroups.set(MapService.UNCATEGORIZED, layerGroup());
    mgs.forEach(g => {
      let lg = layerGroup();
      this.lGroups.set(g.id, lg);
    });
  }

  /**
   * Add a temporary marker, ready for editing. This needs to be saved if the user wants it persisted to the database
   * @param marker 
   */
  addTempMarker(marker: MyMarker) {
    this.newMarkersLayer.clearLayers()
    marker.marker.addTo(this.newMarkersLayer)
    marker.marker.addEventListener('click', event => {
      this.zone.run(() => {
        var m = <Marker>event.target
        let marker = new MyMarker(m)
        marker.selected = true
        this.select(new MyMarker(m))
      });
    })
  }

  /**
   * Create a new Temporary Marker (one that has not been saved yet)
   */
  public newTempMarker(): MyMarker {
    let markerTypeId = this.getDefaultMarker(this._mapCfg)
    var loc = this.getCenter()
    var icn = this.markerTypes.get(markerTypeId)
    if (icn == undefined) {
      console.log("ERROR NO ICON");
    }
    var m = new MyMarker(marker(loc, { icon: icn, draggable: false }))
    m.id = UUID.UUID().toString()
    m.name = "New Marker"
    m.type = markerTypeId
    m.map = this._mapCfg.id

    return m
  }

  openMap(mapId: string) {
    let me = this.maps.find(m => m.id == mapId)
    if (me) {
      this.setConfig(me)
    }
  }

  setConfig(mapCfg: MapConfig) {
    this._mapCfg = mapCfg
    this.mapConfig.next(mapCfg)
  }

  setMap(map: LeafletMap): any {
    this._map = map
    this.map.next(map)
  }

  panTo(location: any) {
    if (this._map !== undefined) {
      this._map.panTo(location)
    }
  }

  getCenter(): LatLng {
    if (this._map !== undefined) {
      return this._map.getCenter()
    }
  }
  fit(bounds): any {
    if (this._map !== undefined) {
      return this._map.fitBounds(bounds)
    }
  }

  select(...items) {
    this.selection.next(new Selection(items))
  }
  markerAdded(marker: MyMarker) {
    this.markerReady.next(marker)
  }
  markerRemoved(marker: MyMarker) {
    this.markerRemove.next(marker)
  }


  getMarkerType(id: string): MarkerType {
    return this.types.get(id)
  }

  update(me: Marker) {
    this.updates.next(me)
  }

  getDefaultMarker(item: MapConfig): string {
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
    let s = this.toSavedMarker(m)
    console.log(s);
    this.data.saveMarker(s)
  }

  deleteMarker(m: MyMarker) {
    this.data.deleteMarker(this.toSavedMarker(m))
  }

  public toMyMarker(m: Marker): MyMarker {
    return new MyMarker(m)
  }


  public fromSavedMarker(saved: SavedMarker): MyMarker {

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
    m.edit = saved.edit
    m.map = saved.map
    m.mapLink = saved.mapLink
    m.markerGroup = saved.markerGroup
    m.description = saved.description

    return m
  }

  public toSavedMarker(m: MyMarker): SavedMarker {
    let location: [number, number] = [m.marker.getLatLng().lat, m.marker.getLatLng().lng]

    let saved = new SavedMarker()
    saved.id = m.id
    saved.name = m.name
    saved.description = m.description
    saved.location = location
    saved.type = m.type
    saved.edit = m.edit
    saved.view = m.view
    saved.map = m.map
    saved.mapLink = m.mapLink
    saved.markerGroup = m.markerGroup
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
  get markerGroup(): string {
    return this.m["__markerGroup"]
  }
  set markerGroup(my: string) {
    this.m["__markerGroup"] = my
  }
  get pageUrl(): string {
    return this.m["__pageUrl"]
  }
  set pageUrl(my: string) {
    this.m["__pageUrl"] = my
  }
  get mapLink(): string {
    return this.m["__mapLink"]
  }
  set mapLink(my: string) {
    this.m["__mapLink"] = my
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
  set map(id: string) {
    this.m["__map"] = id
  }
  get selected(): boolean {
    return this.m["__selected"]
  }
  set selected(id: boolean) {
    this.m["__selected"] = id
  }
  get iconUrl(): string {
    // console.log("this.m " + this.m);
    // console.log("this.m.options" + this.m.options);
    // console.log("this.m.options.icon " + this.m.options.icon);
    // console.log("this.m.options.icon.options " + this.m.options.icon.options);
    // console.log("this.m.options.icon.options.iconUrl " + this.m.options.icon.options.iconUrl);
    return this.m.options.icon.options.iconUrl
  }
}

class Category {
  appliesTo: string[];
  name: string
  id: string
  types: MarkerType[] = []
}
