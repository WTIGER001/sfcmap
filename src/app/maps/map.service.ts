import { Injectable, NgZone } from '@angular/core';
import { ReplaySubject, combineLatest, BehaviorSubject, of, Subject } from 'rxjs';
import { Map as LeafletMap, LatLng, Layer, LayerGroup, Marker, layerGroup, icon, IconOptions, marker, Icon, latLng, DomUtil } from 'leaflet';
import { MapConfig, Selection, MarkerGroup, MarkerType, MapType, User, AnchorPostitionChoice, Category, ImageAnnotation, ItemAction, Operation, UserAssumedAccess, MapPrefs } from '../models';
import { DataService } from '../data.service';
import { mergeMap, concatMap, map, buffer, bufferCount, take, first, debounceTime, tap } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import { NotifyService, Debugger } from '../notify.service';
import * as L from 'leaflet'
import { Annotation, MarkerTypeAnnotation, IconZoomLevelCache } from '../models';
import { flatten } from '@angular/compiler';
import { Router } from '@angular/router';
import { Ping } from '../leaflet/ping';
import { MapShareData, ShareEvent } from '../models/system-models';
import { FowManager, FogOfWar } from './fow';
import { MapAsset } from '../data-asset';
import { LightingManager } from './lighting';
import * as _ from 'lodash'
import { LightImageRenderer } from './pathfinder-lighting';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  
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
  // groups: MarkerGroup[] = []

  // types = new Map<string, MarkerType>()

  /** Array of all Saved Markers for this map that the user has the permision to view */
  markers: MarkerTypeAnnotation[] = []

  /** Array of all the Map Types */
  mapTypes: MapType[]

  /** Marker Types */
  types = new Map<string, MarkerType>()

  myMarkers = new Map<string, Annotation>()


  actions = new Array<MapAction>()

  myMarks: Annotation[] = []

  // Layers
  /** All the layers that are displayed on the map */
  layers: Layer[];

  /** The layer that is used to draw the new marker on.  */
  newMarkersLayer: LayerGroup;

  /** The top level layer that all the marker layer groups are added to */
  allMarkersLayer: LayerGroup;

  overlayLayer: L.ImageOverlay

  fowMgr: FowManager

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

  public annotationAddUpate = new Subject()
  public annotationDelete = new Subject()

  mapPrefs: MapPrefs
  public completeMarkerGroups = new ReplaySubject<Array<MarkerGroup>>(1)

  annotationDeletions$ : Subject<Annotation> = new Subject()

  mouseCoord

  log: Debugger
  mapLoad: Debugger
  markerZoomLog: Debugger
  processingEvent = false

  fogOfWar : MapAsset<FogOfWar>
  lighting : LightingManager
  lightRenderer: LightImageRenderer 

  constructor(private zone: NgZone, private data: DataService, private notify: NotifyService, private router: Router) {
    this.log = this.notify.newDebugger('Map')
    this.mapLoad = this.notify.newDebugger('Map Loading')
    this.markerZoomLog = this.notify.newDebugger('Marker Zoom')
    this.fowMgr = new FowManager(this, data)
    this.lighting = new LightingManager(this, this.data, zone)
    this.lightRenderer = new LightImageRenderer(this, this.data)

    this.iconCache = new IconZoomLevelCache(this.markerZoomLog, this.mapLoad)

    // When the map changees regenerate all the cached icons. We do this because the scale can change for the map and there may me more zoom levels
    this.map.subscribe(m => {
      this.iconCache.clear()
      this.iconCache.minZoom = m.getMinZoom()
      this.iconCache.maxZoom = m.getMaxZoom()
      this.log.debug(`Map Changed, New Zoom Levels are ${m.getMinZoom()} to ${m.getMaxZoom()}`)
      this.addMapListeners(m)
    })

    this.data.userMapPrefs.subscribe(prefs => {
      this.mapPrefs = prefs
    })

    // When the array of available maps changes just update
    this.data.gameAssets.maps.items$.subscribe(
      maps => this.maps = maps
    )

    this.data.gameAssets.shareEvents.subscribe( event => {
      const mapData: MapShareData = event.data
      if (data.isListening() && mapData.mapId == this._mapCfg.id) {
        this.processingEvent = true
        const ll = latLng(mapData.lat, mapData.lng)
        this._map.setView(ll, mapData.zoom, { animate : true})
      }
    })

    // When the user preferences change
    let userObs = this.data.user.pipe(
      map(u => this.user = u)
    )
    // userObs.subscribe(user => this.setDefaultMap(user))

    // Load the Map Types
    this.data.gameAssets.mapTypes.items$.subscribe(t => this.mapTypes = t)

    // Load the Categories
    this.data.categories.subscribe(cats => {
      this.mapLoad.debug("Loading Categories ... " + cats.length)
      this.categories = cats
    })

    this.mapConfig.pipe(
      mergeMap(cfg => this.data.getCompleteAnnotationGroups(cfg.id)),
      tap(groups => this.completeMarkerGroups.next(groups))
    ).subscribe()

    this.fogOfWar = new MapAsset<FogOfWar>(FogOfWar.TYPE).subscribe(this.mapConfig, notify, data);

    this.fogOfWar.item$.pipe(
      tap( fow => console.log("SETTING FOW", fow)),
      tap(fow => this.fowMgr.setFow(fow))
    ).subscribe()

    this.data.gameAssets.markerTypes.items$.pipe(
      map(markertypes => {
        this.iconCache.load(markertypes, this._map)
        this.types.clear()
        markertypes.forEach(type => {
          this.types.set(type.id, type)
        })
        return this.types
      }
      )).subscribe()

    this.registerAction(new CreateMarkerAction())
    this.registerAction(new DeleteMarkerAction())
    this.registerAction(new HiMarkerAction())
  }

  /**
   * Add any listerners to the map 
   * @param map 
   */
  private addMapListeners(map: LeafletMap) {

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

  getMapInfo() : MapShareData {
    const d = new MapShareData()
    d.zoom = this._map.getZoom()
    d.lat = this._map.getCenter().lat
    d.lng = this._map.getCenter().lng
    d.mapId = this._mapCfg.id
    
    return d
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
    m.owner = this.data.game.value.id
    m.name = "New Marker"
    m.markerType = markerTypeId
    m.map = this._mapCfg.id

    let leafletMarker: Marker = m.toLeaflet(this.iconCache)
    if (leafletMarker) {
      console.log('MARKER OPTIONS', leafletMarker.options)
      console.log('MARKER ICON',  leafletMarker.options.icon)
      leafletMarker.addTo(this.newMarkersLayer)
    }
    return m
  }
  
  getDefaultCharacterToken(): any {
    throw new Error("Method not implemented.");
  }

  /**
   * Open the given map
   * @param mapId 
   */
  openMap(mapId: string) {
    this.router.navigate(['/map/' + mapId])
  }

  /**
   * Set the map config
   * @param mapCfg 
   */
  public setConfig(mapCfg: MapConfig) {
    if (mapCfg == null || mapCfg == undefined) {
      let badmapCfg = new MapConfig()
      badmapCfg.id = "BAD"
      this._mapCfg = mapCfg
      this.mapConfig.next(badmapCfg)
    } else {
      if (this._mapCfg && this._mapCfg.id != mapCfg.id) {
        this.select();
      }
      this._mapCfg = mapCfg
      this.mapConfig.next(mapCfg)
    }
  }

  closeMap() {
    this.router.navigate(['/game', this._mapCfg.owner, "maps"])
    this.setConfig(null)
  }

  setConfigId(mapId: string, options?: any) {
    if (mapId) {
      let opts = options || {}
      let center = opts.center;
      let zoom = opts.zoom;
      let sub = this.data.gameAssets.maps.items$.pipe().subscribe(
        maps => {
          let mf = maps.find(m => m.id == mapId || m.name.toLowerCase() == mapId.toLowerCase())
          if (mf) {
            this.setConfig(mf)
            if (center) {
              let ll = center.split(',')
              let loc = latLng(parseFloat(ll[0]), parseFloat(ll[1]))
              this.panTo(loc)

              if (opts.flag) {
                Ping.showFlag(this._map, ll, 10000)
              }
            }
            if (!isNaN(zoom)) {
              this._map.setZoom(zoom)
            }

          }
        }
      )
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

  selectForEdit(...items) {
    this.selection.next(new Selection(items, 'edit'))
  }

  selectForReattach(...items) {
    this.selection.next(new Selection(items, 'reattach'))
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
    if (!m.owner) {
      m.owner == this.data.game.value.id
    }

    if (m.id == 'TEMP') {
      m.id = UUID.UUID().toString()
    }
    if (ImageAnnotation.is(m) && m._saveImage) {
      this.data.saveImageAnnotation(m)
    } else {
      this.data.save(m)
    }
  }

  deleteAnnotation(... annotations: Annotation[]) {
    annotations.forEach( m=> {
      this.annotationDeletions$.next(m)

      if (m.id == 'TEMP') {
        m.getAttachment().removeFrom(this._map)
      } else {
        this.data.delete(m)
      }
    })
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

  annotationsFromMap() : Annotation[] {
    const rtn : Annotation[] = []
    this._map.eachLayer( l => {
      if (l['objAttach']) {
        const obj = l['objAttach']
        if (Annotation.is(obj)) {
          rtn.push(obj)
        }
      }
    })
    return _.uniqBy(rtn, item => item.id)
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