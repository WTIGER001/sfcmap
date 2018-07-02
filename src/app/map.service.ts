import { Injectable, NgZone } from '@angular/core';
import { ReplaySubject, combineLatest, BehaviorSubject } from 'rxjs';
import { Map as LeafletMap, LatLng, Layer, LayerGroup, Marker, layerGroup, icon, IconOptions, marker, Icon, latLng, DomUtil } from 'leaflet';
import { MapConfig, Selection, MarkerGroup, SavedMarker, MarkerType, MapType, UserPreferences, AnchorPostitionChoice } from './models';
import { DataService } from './data.service';
import { mergeMap, concatMap, map, buffer, bufferCount } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import { NotifyService, Debugger } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public static readonly UNCATEGORIZED = "UNGROUPED"

  /** Observable for the current selection */
  public selection = new BehaviorSubject<Selection>(new Selection([]))

  /** Observable for the Leaflet Map that this service is controlling */
  public map = new ReplaySubject<LeafletMap>()

  /** Observable for the Map Config that is associated to the Leaflet map */
  public mapConfig = new ReplaySubject<MapConfig>()

  /** Reference to the current users preferences */
  prefs: UserPreferences

  /** Icons (one per marker type) at each soom level for the map. This is precomputed so that zooming is quick. Note this is computed each time there is a map change  */
  iconCache: IconZoomLevelCache

  /** Array of all avaialable map configs. This is used to provide ??? */
  maps: MapConfig[] = []

  /** Reference to the Leaflet Map that this service is controlling */
  _map: LeafletMap

  /** Reference to the Map Config that is associated to the Leaflet map */
  _mapCfg: MapConfig

  /** Array of all Marker Groups for this map. For each marker group there is an associated layer */
  groups: MarkerGroup[] = []

  /** Array of all Saved Markers for this map that the user has the permision to view */
  markers: SavedMarker[] = []

  /** Array of all the Map Types */
  mapTypes: MapType[]


  myMarkers = new Map<string, MyMarker>()


  myMarks: MyMarker[] = []

  public markersObs = new ReplaySubject<Array<MyMarker>>()

  /** Map of types of markers. The key is the marker type's id. This is a map to make searching for a type quick */
  private types = new Map<string, MarkerType>()

  // Layers
  /** All the layers that are displayed on the map */
  layers: Layer[];

  /** The layer that is used to draw the new marker on.  */
  newMarkersLayer: LayerGroup;

  /** The top level layer that all the marker layer groups are added to */
  allMarkersLayer: LayerGroup;

  /** Map of the LayerGroups that are used for each Marker Group. The key is the marker group id and there is a special layer there for the uncategorized markers */
  lGroups = new Map<string, LayerGroup>()

  /** The categories array. A category is a hierarchichl grouping of marker groups and marker types */
  categories = new Array<Category>()

  /** The Default marker to use if there is no other available. This is only used when the user selects the 'new marker' action */
  defaultMarker: string

  /** Observable indicating that the Categories have been loaded. Should problably just switch this to an observable on the categories. Should also move this to the Data Service */
  catsLoaded = new ReplaySubject<boolean>()

  // Get rid of?
  // public selection = new ReplaySubject<Marker>()
  /** Observable to tell when a marker is ready */
  public markerReady = new ReplaySubject<MyMarker>()
  /** Observable for when a marker is removed */
  public markerRemove = new ReplaySubject<MyMarker>()
  /** Observable for when a marker is updated */
  public updates = new ReplaySubject<Marker>()
  /** Icons for the marker by type */
  markerTypes = new Map<string, Icon>()

  mouseCoord

  log: Debugger
  mapLoad: Debugger
  markerZoomLog: Debugger

  constructor(private zone: NgZone, private data: DataService, private notify: NotifyService) {
    this.log = this.notify.newDebugger()
    this.mapLoad = this.notify.newDebugger('Map Loading')
    this.markerZoomLog = this.notify.newDebugger('Marker Zoom')

    this.allMarkersLayer = layerGroup()
    this.newMarkersLayer = layerGroup()
    this.iconCache = new IconZoomLevelCache(this.markerZoomLog)

    // When the map changees regenerate all the cached icons. We do this because the scale can change for the map and there may me more zoom levels
    this.map.subscribe(m => {
      this.iconCache.clear()
      this.iconCache.minZoom = m.getMinZoom()
      this.iconCache.maxZoom = m.getMaxZoom()

      this.log.debug(`Map Changed, New Zoom Levels are ${m.getMinZoom()} to ${m.getMaxZoom()}`)

      this.addMapListeners(m)
    })

    // When the array of available maps changes just update
    this.data.maps.subscribe(
      maps => this.maps = maps
    )

    // When the user preferences change
    let prefsObs = this.data.userPrefs.pipe(
      map(prefs => this.prefs = prefs)
    )
    prefsObs.subscribe(prefs => this.setDefaultMap(prefs))

    // Load the Map Types
    this.data.mapTypes.subscribe(t => this.mapTypes = t)

    // Load the Categories
    let loadCategoriesObs = this.data.markerCategories.pipe(map(cats => {
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
    }))

    loadCategoriesObs.subscribe(() => {
      this.mapLoad.debug("Loaded Categories")
    })

    // Load each of the icons
    let expectedCount = 0
    let loadIconsObs = this.catsLoaded.pipe(
      mergeMap(v => {
        this.defaultMarker = undefined
        return this.data.markerTypes
      }),
      concatMap(items => {
        expectedCount = items.length
        this.categories.forEach(c => {
          c.types = []
        })
        return items
      }),
      mergeMap((value, index) => this.data.fillInUrl(value), 5),
      map(markerType => {
        let icn = icon({
          iconUrl: markerType.url,
          iconSize: markerType.iconSize,
          iconAnchor: markerType.iconAnchor
        })
        this.iconCache.addIcon(markerType, this._map)
        this.types.set(markerType.id, markerType)
        this.markerTypes.set(markerType.id, icn)
        let cat = this.categories.find(c => c.id == markerType.category)
        if (cat) {
          cat.types.push(markerType)
        } else {
          this.mapLoad.debug(this.mapLoad.fmt("No Category found for {0}", markerType.category))
        }
        if (this.defaultMarker == undefined) {
          this.defaultMarker = markerType.id
        }
      }),
      bufferCount(expectedCount)
    )
    loadIconsObs.subscribe(() => {
      this.mapLoad.debug("Loaded Icons")
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
          this.mapLoad.debug(`Processing ${markers.length} Markers`)

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
        this.mapLoad.debug(`Building Layers`)
        this.allMarkersLayer.clearLayers()

        // Loop through the groups. Add each group to the map
        this.groups.forEach(g => {
          this.addGroup(g.id)
        })
        this.addGroup(MapService.UNCATEGORIZED)

        // Loop through the markers. Add each marker to the group layer
        if (this.myMarks) {
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
        }
      })
  }


  private setDefaultMap(prefs: UserPreferences) {
    if (!this._mapCfg) {
      if (prefs.recentMaps && prefs.recentMaps.length > 0) {
        let mapId = prefs.recentMaps[0];
        let mapConfig = this.maps.find(m => m.id == mapId);
        if (mapConfig) {
          this.setConfig(mapConfig);
        }
      }
    }
  }

  /**
   * Add any listerners to the map 
   * @param map 
   */
  private addMapListeners(map: LeafletMap) {
    map.on('zoomend', () => {
      var currentZoom = map.getZoom();
      this.markerZoomLog.debug(`Map zoomed to ${currentZoom}`)
      map.eachLayer(catLayer => {
        this.updateMarkerSizes(currentZoom, catLayer)
      })

      // Fix the selection class
      this.styleSelection()
    })

    map.on('zoom', () => {
      var currentZoom = map.getZoom();
      this.markerZoomLog.debug(`Map zooming`)
    })

    map.on('keypress ', (event: any) => {
      this.markerZoomLog.debug("Key Press ", event)
      if (event.originalEvent.ctrlKey && event.originalEvent.code == 'KeyM') {
        this.markerZoomLog.debug("Creating new Marker at : ", this.mouseCoord)
        let m = this.newTempMarker(this.mouseCoord)
        this.markerZoomLog.debug("New Marker Created: ", m)
        this.addTempMarker(m)
      }
    })
    map.on('mousemove ', (event: any) => {
      this.mouseCoord = event.latlng
    })
  }

  /**
   * Add the necessary styleing to each marker that is selected
   */
  private styleSelection() {
    let sel = this.selection.getValue()
    if (!sel.isEmpty()) {
      sel.items.forEach(item => {
        if (this.isMarker(item)) {
          DomUtil.addClass(item["_icon"], 'iconselected')
        } else if (MyMarker.is(item)) {
          DomUtil.addClass(item.marker["_icon"], 'iconselected')
        }
      })
    }
  }

  private isMarker(obj: any): obj is Marker {
    return obj.options && obj.options.icon
  }

  private isLayerGroup(obj: any): obj is LayerGroup {
    return obj.eachLayer
  }

  /**
   * Update the Marker Sizes as appropriate for each marker in the given layer. This function is recursive and will cascade.
   * @param zoomLevel The zoom level to use when determining the correct sizing
   * @param layer The layer to look in for markers
   */
  private updateMarkerSizes(zoomLevel: number, layer: Layer) {
    if (this.isMarker(layer)) {
      this.updateMarkerSize(layer, zoomLevel)
    } else if (this.isLayerGroup(layer)) {
      layer.eachLayer(child => {
        this.updateMarkerSizes(zoomLevel, child)
      })
    }
  }

  /**
   * Updates the size of a marker based on the zoom level
   * @param marker The Marker to update
   * @param zoomLevel The zoom level to use when determining the correct sizing
   */
  private updateMarkerSize(marker: Marker, zoomLevel: number) {
    let icn = this.iconCache.getIcon(marker['__type'], zoomLevel)
    if (icn) {
      marker.setIcon(icn)
    } else {
      this.markerZoomLog.debug(`NOT Updating Icon ${marker["__type"]} at zoom : ${zoomLevel}`)
    }
  }

  /**
   * Adds the ayer group associated with a group id to the allMarkersLayer
   * @param groupId Group Id to add
   */
  private addGroup(groupId: string) {
    if (!this.prefs.isHiddenGroup(this._mapCfg.id, groupId)) {
      let lGroup = this.lGroups.get(groupId)
      if (lGroup) {
        lGroup.clearLayers()
        lGroup.addTo(this.allMarkersLayer)
      }
    }
  }

  /**
   * Adds necessary event listeners
   * @param m The marker to add listeners to
   */
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

  /**
   * Make all the LayerGroups
   * @param mgs Marker Groups
   */
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
  public newTempMarker(latlng?: LatLng): MyMarker {
    let markerTypeId = this.getDefaultMarker(this._mapCfg)

    if (!latLng) {
      latlng = this.getCenter()
    }

    // var loc = this.getCenter()
    var icn = this.markerTypes.get(markerTypeId)
    if (icn == undefined) {
      this.mapLoad.debug('No icon for the temporary marker')
    }
    var m = new MyMarker(marker(latlng, { icon: icn, draggable: false }))
    m.id = UUID.UUID().toString()
    m.name = "New Marker"
    m.type = markerTypeId
    m.map = this._mapCfg.id

    return m
  }

  /**
   * Open the given map
   * @param mapId 
   */
  openMap(mapId: string) {
    let me = this.maps.find(m => m.id == mapId)
    if (me) {
      this.setConfig(me)
    }
  }

  /**
   * Set the map config
   * @param mapCfg 
   */
  setConfig(mapCfg: MapConfig) {
    this._mapCfg = mapCfg
    this.mapConfig.next(mapCfg)
  }

  /**
   * Set the Map (should be called once)
   * @param map 
   */
  setMap(map: LeafletMap): any {
    this._map = map
    this.map.next(map)
  }

  /**
   * Centers the map on a location
   * @param location 
   */
  panTo(location: any) {
    if (this._map !== undefined) {
      // this._map.panTo(location)
      this._map.flyTo(location)
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
    this.mapLoad.debug('Saving Marker ', s)

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
      this.mapLoad.debug(this.mapLoad.fmt("Cannot find marker with id {0}", saved.type))
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
    return this.m.options.icon.options.iconUrl
  }
}

class Category {
  appliesTo: string[];
  name: string
  id: string
  types: MarkerType[] = []
}


class IconZoomLevelCache {
  minZoom = 0
  maxZoom = 20
  cache = new Map<string, Icon[]>()

  constructor(private log: Debugger) {

  }

  clear() {
    this.cache.clear()
  }

  addIcon(type: MarkerType, map: LeafletMap) {
    let maxZoom = Math.min(this.maxZoom, 10)
    let minZoom = Math.max(this.minZoom, -5)

    let icons = []

    if (type.sizing == 'variable') {
      this.log.debug("Variable Sized Icon: " + type.name)
      this.log.debug("Variable Sized Icon: ", type.name)

      for (let i = minZoom; i <= maxZoom; i++) {
        // Some of the icons have min or max zoom level where they cap out in size
        let zoomLevel = this.limit(i, type.zoomRange[0], type.zoomRange[1])
        let size = this.scale(map, zoomLevel, type.iconSize)
        let anchor = this.calcAnchor(size, type)

        if (type.name == 'Lich Agent') {
          this.log.debug('Lich zoom: ', i, zoomLevel, size, anchor)
        }

        let icn = icon({
          iconUrl: type.url,
          iconSize: size,
          iconAnchor: anchor
        })

        icons.push(icn)
      }
    } else {
      this.log.debug("Fixed Sized Icon: " + type.name)
      this.log.debug("Fixed Sized Icon: ", type.name)

      let icn = icon({
        iconUrl: type.url,
        iconSize: type.iconSize,
        iconAnchor: type.iconAnchor
      })
      for (let i = minZoom; i <= maxZoom; i++) {
        icons.push(icn)
      }
    }
    this.cache.set(type.id, icons)
  }

  limit(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
  }

  /**
   * Calculate how large or small the marker should be at the given zoom level
   * @param map The Map that will be projected 
   * @param zoom The zoom level to use
   * @param size The original size of the marker (in pixels) for the map at native resolution
   */
  scale(map: LeafletMap, zoom: number, size: [number, number]): [number, number] {


    let a = map.project([0, 0], zoom)
    let b = map.project([size[1], size[0]], zoom)
    let c = a.subtract(b)
    return [Math.abs(c.x), Math.abs(c.y)]
  }

  calcAnchor(size: [number, number], type: MarkerType, ): [number, number] {

    let [sx, sy] = [1, 1]
    if (type.anchorPosition == AnchorPostitionChoice.BottomLeft) {
      sx = 0
      sy = size[1]
    } else if (type.anchorPosition == AnchorPostitionChoice.BottomCenter) {
      sx = 0.5 * size[0]
      sy = size[1]
    } else if (type.anchorPosition == AnchorPostitionChoice.BottomRight) {
      sx = size[0]
      sy = size[1]
    } else if (type.anchorPosition == AnchorPostitionChoice.MiddleLeft) {
      sx = 0
      sy = 0.5 * size[1]
    } else if (type.anchorPosition == AnchorPostitionChoice.MiddleCenter) {
      sx = 0.5 * size[0]
      sy = 0.5 * size[1]
    } else if (type.anchorPosition == AnchorPostitionChoice.MiddleRight) {
      sx = size[0]
      sy = 0.5 * size[1]
    } else if (type.anchorPosition == AnchorPostitionChoice.TopLeft) {
      sx = 0
      sy = 0
    } else if (type.anchorPosition == AnchorPostitionChoice.TopCenter) {
      sx = 0.5 * size[0]
      sy = 0
    } else if (type.anchorPosition == AnchorPostitionChoice.TopRight) {
      sx = size[0]
      sy = 0
    }

    return [sx, sy]
  }

  getIcon(id: string, zoomLevel: number): Icon {
    let index = zoomLevel - this.minZoom
    let icons = this.cache.get(id)
    if (icons) {
      return icons[index]
    }
    return undefined
  }

}