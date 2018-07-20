import { Injectable, NgZone } from '@angular/core';
import { ReplaySubject, combineLatest, BehaviorSubject, of } from 'rxjs';
import { Map as LeafletMap, LatLng, Layer, LayerGroup, Marker, layerGroup, icon, IconOptions, marker, Icon, latLng, DomUtil } from 'leaflet';
import { MapConfig, Selection, MarkerGroup, MarkerType, MapType, User, AnchorPostitionChoice, Category } from './models';
import { DataService } from './data.service';
import { mergeMap, concatMap, map, buffer, bufferCount, take } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import { NotifyService, Debugger } from './notify.service';
import * as L from 'leaflet'
import { Annotation, MarkerTypeAnnotation, IconZoomLevelCache } from './models';
import { flatten } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  public completeMarkerGroups = new ReplaySubject<Array<MarkerGroup>>()

  /** Observable for the current selection */
  public selection = new BehaviorSubject<Selection>(new Selection([]))

  /** Observable for the Leaflet Map that this service is controlling */
  public map = new ReplaySubject<LeafletMap>()

  /** Observable for the Map Config that is associated to the Leaflet map */
  public mapConfig = new ReplaySubject<MapConfig | null>()

  /** Reference to the current users preferences */
  user: User

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

  types = new Map<string, MarkerType>()

  /** Array of all Saved Markers for this map that the user has the permision to view */
  markers: MarkerTypeAnnotation[] = []

  /** Array of all the Map Types */
  mapTypes: MapType[]


  myMarkers = new Map<string, Annotation>()


  actions = new Array<MapAction>()

  myMarks: Annotation[] = []

  // public markersObs = new ReplaySubject<Array<Annotation>>()

  /** Map of types of markers. The key is the marker type's id. This is a map to make searching for a type quick */
  private = new Map<string, MarkerType>()

  // Layers
  /** All the layers that are displayed on the map */
  layers: Layer[];

  /** The layer that is used to draw the new marker on.  */
  newMarkersLayer: LayerGroup;

  /** The top level layer that all the marker layer groups are added to */
  allMarkersLayer: LayerGroup;

  overlayLayer: L.ImageOverlay

  /** Map of the LayerGroups that are used for each Marker Group. The key is the marker group id and there is a special layer there for the uncategorized markers */
  lGroups = new Map<string, L.FeatureGroup>()

  /** The categories array. A category is a hierarchichl grouping of marker groups and marker types */
  categories = new Array<Category>()

  /** The Default marker to use if there is no other available. This is only used when the user selects the 'new marker' action */
  defaultMarker: string

  // Get rid of?
  // public selection = new ReplaySubject<Marker>()
  /** Observable to tell when a marker is ready */
  public markerReady = new ReplaySubject<Annotation>()
  /** Observable for when a marker is removed */
  public markerRemove = new ReplaySubject<Annotation>()
  /** Observable for when a marker is updated */
  public updates = new ReplaySubject<Marker>()

  mouseCoord

  log: Debugger
  mapLoad: Debugger
  markerZoomLog: Debugger

  constructor(private zone: NgZone, private data: DataService, private notify: NotifyService) {
    this.log = this.notify.newDebugger('Map')
    this.mapLoad = this.notify.newDebugger('Map Loading')
    this.markerZoomLog = this.notify.newDebugger('Marker Zoom')

    this.allMarkersLayer = layerGroup()
    this.allMarkersLayer['title'] = "All Markers"

    this.newMarkersLayer = layerGroup()
    this.newMarkersLayer['title'] = "New Markers"
    this.iconCache = new IconZoomLevelCache(this.markerZoomLog, this.mapLoad)

    // When the map changees regenerate all the cached icons. We do this because the scale can change for the map and there may me more zoom levels
    this.map.subscribe(m => {
      this.iconCache.clear()
      this.iconCache.minZoom = m.getMinZoom()
      this.iconCache.maxZoom = m.getMaxZoom()
      this.log.debug(`Map Changed, New Zoom Levels are ${m.getMinZoom()} to ${m.getMaxZoom()}`)
      this.addMapListeners(m)
      // m.editOptions.featuresLayer = this.allMarkersLayer
      // m.editOptions.editLayer = layerGroup().addTo(m)
      // m.editOptions.editLayer['title'] = "Edit Layer"
    })

    // When the array of available maps changes just update
    this.data.maps.subscribe(
      maps => this.maps = maps
    )

    // When the user preferences change
    let userObs = this.data.user.pipe(
      map(u => this.user = u)
    )
    userObs.subscribe(user => this.setDefaultMap(user))

    // Load the Map Types
    this.data.mapTypes.subscribe(t => this.mapTypes = t)

    // Load the Categories
    this.data.categories.subscribe(cats => {
      this.mapLoad.debug("Loading Categories ... " + cats.length)
      this.categories = cats
    })

    let makeMarkerTypes = this.data.markerTypes.pipe(map(
      markertypes => {
        this.mapLoad.debug("Loading Marker Types")
        this.iconCache.load(markertypes, this._map)
        this.types.clear()
        markertypes.forEach(type => {
          this.types.set(type.id, type)
        })
        this.mapLoad.debug("Loading Marker Types", this.types)
        return this.types
      }
    ))

    // Load the groups
    this.mapConfig.pipe(
      mergeMap(mapCfg => mapCfg.id != 'BAD' ? this.data.getCompleteAnnotationGroups(mapCfg.id) : of([]))
    ).subscribe(groups => {
      this.completeMarkerGroups.next(groups)
    })

    let loadGroups = this.completeMarkerGroups.pipe(
      map(groups => {
        this.groups = groups
        this.makeLayerGroups(groups)
        return groups
      })
    )

    combineLatest(this.mapConfig, loadGroups, userObs, makeMarkerTypes).subscribe((value) => {
      const mapCfg = value[0]
      const groups = value[1]
      const user = value[2]

      if (mapCfg.id == 'BAD') {
        return
      }

      // this.allMarkersLayer.clearLayers()
      this.allMarkersLayer.clearLayers()

      groups.forEach(grp => {
        this.buildGroup(grp, user, mapCfg)
      })
    });

    this.registerAction(new CreateMarkerAction())
    this.registerAction(new DeleteMarkerAction())
    this.registerAction(new HiMarkerAction())
  }


  private makeLayerGroups(mgs: MarkerGroup[]) {
    // Clear out the map
    this.lGroups.clear()

    // Create the new layers
    mgs.forEach(g => {
      let lg = L.featureGroup()
      lg['title'] = g.name
      lg.on('click', this.onAnnotationClick, this)
      this.lGroups.set(g.id, lg);
    });
  }

  private buildGroup(grp: MarkerGroup, user: User, mapCfg: MapConfig) {
    if (!user.isHiddenGroup(mapCfg.id, grp.id)) {
      let lGroup = this.lGroups.get(grp.id)
      if (lGroup) {
        lGroup.clearLayers()
        lGroup.addTo(this.allMarkersLayer)

        grp._annotations.forEach(annotation => {
          if (!user.isHiddenMarker(mapCfg.id, annotation.id)) {
            // Create and bind the leaflet type
            let item = annotation.toLeaflet(this.iconCache)
            item['title'] = annotation.name
            if (grp.showText) {
              let cls = grp.textStyle || 'sfc-tooltip-default'
              item.bindTooltip(annotation.name, { permanent: true, direction: "center", className: cls })
            }
            item.addTo(lGroup)
          }
        })
      }
    }
  }

  private setDefaultMap(prefs: User) {
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

      let action = this.actions.find(a => this.matchKey(a, event.originalEvent))
      if (action) {
        this.log.debug("Running Action : ", action.name)
        action.doAction(this)
      }
    })

    map.on('mousemove ', (event: any) => {
      this.mouseCoord = event.latlng
    })
  }

  registerAction(action: MapAction) {
    this.actions.push(action)
  }

  unregisterAction(action: MapAction) {
    this.actions.push(action)
  }

  matchKey(action: MapAction, event: any): boolean {
    const ctrl = "CTRL"
    const shift = "SHIFT"
    const alt = "ALT"
    let parts = action.keyTrigger.toUpperCase().split("+")

    if (parts.includes(ctrl) && !event.ctrlKey) {
      return false
    }
    if (parts.includes(shift) && !event.shiftKey) {
      return false
    }
    if (parts.includes(alt) && !event.altKey) {
      return false
    }
    const key = event.key.toUpperCase()
    return parts.includes(key)
  }


  /**
   * Add the necessary styleing to each marker that is selected
   */
  private styleSelection() {
    let sel = this.selection.getValue()
    if (!sel.isEmpty()) {
      sel.items.forEach(item => {
        if (this.isMarker(item) && item["_icon"]) {
          DomUtil.addClass(item["_icon"], 'iconselected')
        } else if (MarkerTypeAnnotation.is(item) && item.getAttachment()["_icon"]) {
          DomUtil.addClass(item.getAttachment()["_icon"], 'iconselected')
        }
      })
    }
  }

  isMarker(obj: any): obj is Marker {
    return obj.options && obj.options.icon
  }

  isLayerGroup(obj: any): obj is LayerGroup {
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

  private onAnnotationClick(event: any) {

    this.zone.run(() => {
      const leafletItem = event.layer
      // this.printLayers()

      const annotation = <Annotation>leafletItem.objAttach
      if (event.originalEvent.ctrlKey) {
        this.addToSelect(annotation)
      } else {
        this.select(annotation)
      }

    })
  }


  public getIcon(typeId: string): Icon {
    return this.iconCache.getIcon(typeId, this._map.getZoom())
  }

  /**
   * Create a new Temporary Marker (one that has not been saved yet)
   */
  public newTempMarker(latlng?: LatLng): MarkerTypeAnnotation {
    let markerTypeId = this.getDefaultMarker(this._mapCfg)

    let point = latlng
    if (latlng == undefined || latlng.lat == undefined) {
      point = this.getCenter()
    }

    const m = new MarkerTypeAnnotation()
    m.points = [point]
    m.id = "TEMP"
    m.name = "New Marker"
    m.markerType = markerTypeId
    m.map = this._mapCfg.id

    let leafletMarker: Marker = m.toLeaflet(this.iconCache)
    leafletMarker.addTo(this.newMarkersLayer)

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
    console.log("Setting COnfiguration ", mapCfg);

    this._mapCfg = mapCfg
    if (mapCfg == null || mapCfg == undefined) {
      let badmapCfg = new MapConfig()
      badmapCfg.id = "BAD"
      this.mapConfig.next(badmapCfg)
    } else {

      this.mapConfig.next(mapCfg)
    }
  }

  /**
   * Set the Map (should be called once)
   * @param map 
   */
  setMap(map: LeafletMap): any {
    this._map = map

    // map.editTools.editLayer['title'] = "Edit Layer"
    // map.editTools.featuresLayer['title'] = "Feature Layer"

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

  addToSelect(...items: any[]) {
    let old = this.selection.getValue()
    let allItems = old.items.slice(0)
    items.forEach(item => {
      let indx = allItems.findIndex(i => item.id == i.id)
      if (indx >= 0) {
        allItems.splice(indx, 1)
      } else {
        allItems.push(item)
      }
    })
    let sel = new Selection(allItems)
    this.selection.next(sel)
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

  saveAnnotation(m: Annotation) {
    if (m.id == 'TEMP') {
      m.id = UUID.UUID().toString()
    }
    this.data.save(m)
  }

  deleteAnnotation(m: Annotation) {
    if (m.id == 'TEMP') {
      m.getAttachment().removeFrom(this._map)
    } else {
      this.data.delete(m)
    }
  }

  printLayers() {
    let root = new Node()
    root.title = "ROOT"
    this._map.eachLayer(l => {
      this.popLayers(l, root)
    })

    // Trim the layers
    let all = root.flatten()
    let titles = new Map<string, number>()
    all.forEach(n => {
      titles.set(n.title, (titles.get(n.title) || 0) + 1)
    })
    titles.forEach((cnt, title) => {
      if (cnt > 1) {
        let items = all.filter(n => n.title == title)
        items.sort((a, b) => a.depth - b.depth)
        items.pop()
        items.forEach(n => {
          n.remove()
        })
      }
    })

    // Print nodes
    this.printNode(root)
  }

  printNode(n: Node) {
    let space = this.space(n.depth)
    console.log(space, n.title);
    n.children.forEach(child => {
      this.printNode(child)
    })
  }

  popLayers(l: any, n: Node) {
    let child = new Node()
    child.title = (l.title || 'NO TITLE') + ' (' + l._leaflet_id + ')'
    n.add(child)

    if (l.eachLayer) {
      l.eachLayer(childLayer => {
        this.popLayers(childLayer, child)
      })
    }
  }

  private space(times: number): string {
    let data = ''
    for (let i = 0; i < times; i++) {
      data += '  '
    }
    return data
  }
}

class Node {
  depth: number = 0
  title: string
  parent: Node
  children: Node[] = []

  add(child: Node) {
    this.children.push(child)
    child.parent = this
    child.depth = this.depth + 1
  }

  remove() {
    if (this.parent) {
      let indx = this.parent.children.indexOf(this)
      this.parent.children.splice(indx, 1)
    }
  }

  flatten(): Node[] {
    let flat = []
    flat.push(this)
    this.children.forEach(child => {
      let childFlat = child.flatten()
      flat.push(...childFlat)
    })
    return flat
  }
}

export interface MapAction {
  name: string
  keyTrigger: string
  doAction(mapSvc: MapService)
}

class CreateMarkerAction implements MapAction {
  name: string
  keyTrigger: string

  constructor() {
    this.name = "Create Marker"
    this.keyTrigger = "CTRL+M"
  }

  doAction(mapSvc: MapService) {
    mapSvc.newTempMarker(mapSvc.mouseCoord)
  }
}

class DeleteMarkerAction implements MapAction {
  get name() { return "Delete Selected Marker" }
  get keyTrigger() { return "SHIFT+D" }
  doAction(mapSvc: MapService) {
    mapSvc.selection.pipe(
      take(1)
    ).subscribe(sel => {
      let m = sel.first
      if (m || Annotation.is(m)) {
        mapSvc.deleteAnnotation(m)
      }
    })
  }
}

class HiMarkerAction implements MapAction {
  get name() { return "HI" }
  get keyTrigger() { return "SHIFT+H" }
  doAction(mapSvc: MapService) {
    mapSvc.log.info("Hi from your keyboard")
  }
}