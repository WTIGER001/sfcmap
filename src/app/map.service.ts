import { Injectable, NgZone } from '@angular/core';
import { ReplaySubject, combineLatest, BehaviorSubject, of } from 'rxjs';
import { Map as LeafletMap, LatLng, Layer, LayerGroup, Marker, layerGroup, icon, IconOptions, marker, Icon, latLng, DomUtil } from 'leaflet';
import { MapConfig, Selection, MarkerGroup, MarkerType, MapType, User, AnchorPostitionChoice, Category, ImageAnnotation, ItemAction, Operation, UserAssumedAccess, MapPrefs } from './models';
import { DataService } from './data.service';
import { mergeMap, concatMap, map, buffer, bufferCount, take, first, debounceTime } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import { NotifyService, Debugger } from './notify.service';
import * as L from 'leaflet'
import { Annotation, MarkerTypeAnnotation, IconZoomLevelCache } from './models';
import { flatten } from '@angular/compiler';
import { Router } from '@angular/router';
import { Ping } from './leaflet/ping';

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

  access: UserAssumedAccess
  mapPrefs: MapPrefs


  mouseCoord

  log: Debugger
  mapLoad: Debugger
  markerZoomLog: Debugger

  constructor(private zone: NgZone, private data: DataService, private notify: NotifyService, private router: Router) {
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
    })

    this.data.userAccess.subscribe(ua => {
      this.access = ua
    })

    this.data.userMapPrefs.subscribe(prefs => {
      this.mapPrefs = prefs
    })

    // When the array of available maps changes just update
    this.data.gameAssets.maps.items$.subscribe(
      maps => this.maps = maps
    )

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

    let makeMarkerTypes = this.data.gameAssets.markerTypes.items$.pipe(map(
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

    combineLatest(this.mapConfig, makeMarkerTypes)
      .pipe().subscribe((value) => {
        const mapCfg = value[0]

        this.clearLayerGroups()
        if (mapCfg.id != 'BAD') {
          this.getAnnotationsAndGroups()
          this.reattachSelection(this.groups)
        }
      })

    this.data.userMapPrefs.subscribe(prefs => {
      this.groups.forEach(grp => {
        this.ensureGroupVisibility(grp, !prefs.isHiddenGroup(this._mapCfg.id, grp.id))
        grp._annotations.forEach(a => {
          this.ensureAnnotationVisibility(a, grp, !prefs.isHiddenMarker(this._mapCfg.id, a.id))
        })
      })
    })

    this.registerAction(new CreateMarkerAction())
    this.registerAction(new DeleteMarkerAction())
    this.registerAction(new HiMarkerAction())
  }

  private ensureGroupVisibility(group: MarkerGroup, visible: boolean) {
    let layer = this.lGroups.get(group.id)
    if (layer) {
      if (visible && !this._map.hasLayer(layer)) {
        layer.addTo(this._map)
      } else if (!visible && this._map.hasLayer(layer)) {
        layer.remove()
      }
    } else {
      console.log(">>>No Layer... skipping")
    }
  }

  private ensureAnnotationVisibility(annotation: Annotation, group: MarkerGroup, visible: boolean) {
    let item = annotation.toLeaflet(undefined)
    let lGrp = this.lGroups.get(group.id)
    if (lGrp) {
      if (visible && !lGrp.hasLayer(item)) {
        this.addAnnotationItem(item, annotation, group, lGrp)
      } else if (!visible && lGrp.hasLayer(item)) {
        lGrp.removeLayer(item)
      }
    } else {
      console.log(">>>No Layer... skipping")
    }
  }

  private reattachSelection(groups: MarkerGroup[]) {
    let sel = this.selection.getValue()
    if (sel && sel.isEmpty() == false) {
      let items = sel.items.slice(0)
      for (let i = 0; i < items.length; i++) {
        let found = this.findItem(items[i].id, groups)
        if (found) {
          items[i] = found
        } else {
          console.log("NOT FOUND ", items[i]);
        }
      }
      this.selectForReattach(...items)
    }
  }

  findItem(id: string, groups: MarkerGroup[]): Annotation {
    for (let i = 0; i < groups.length; i++) {
      for (let j = 0; j < groups[i]._annotations.length; j++) {
        if (groups[i]._annotations[j].id == id) {
          return groups[i]._annotations[j]
        }
      }
    }
    return undefined
  }

  private getAnnotationsAndGroups() {
    const sub1 = this.data.getAnnotations$(this._mapCfg.id).subscribe(
      action => {
        if (action.op == Operation.Added || action.op == Operation.Updated) {
          this.addOrUpdateAnnotation(action.item)
        } else if (action.op == Operation.Removed) {
          this.removeAnnotation(action.item)
        }
      })
    const sub2 = this.data.getAnnotationGroups$(this._mapCfg.id).subscribe(
      action => {
        if (action.op == Operation.Added || action.op == Operation.Updated) {
          this.addOrUpdateGroup(action.item)
        } else if (action.op == Operation.Removed) {
          this.removeGroup(action.item)
        }
      })

  }

  private addOrUpdateAnnotation(item: Annotation) {
    if (this.mapPrefs.isHiddenMarker(this._mapCfg.id, item.id)) {
      return
    }

    let groupId = item.group || DataService.UNCATEGORIZED
    let group = this.getGroup(groupId)
    let lGrp = this.lGroups.get(groupId)

    let indx = -1

    if (group._annotations) {
      indx = group._annotations.findIndex(a => a.id == item.id)
    }
    if (indx >= 0) {
      // remove it from the map
      let a = group._annotations[indx]
      if (a.getAttachment()) {
        a.getAttachment().remove()
      }
      // update it in the list
      group._annotations[indx] = item
    } else {
      group._annotations.push(item)
    }

    if (lGrp) {
      let mapitem = item.toLeaflet(this.iconCache)
      this.addAnnotationItem(mapitem, item, group, lGrp);
    }
  }

  private addAnnotationItem(mapitem: any, item: Annotation, group: MarkerGroup, lGrp: L.FeatureGroup<any>) {
    mapitem['title'] = item.name;
    if (group.showText) {
      let cls = group.textStyle || 'sfc-tooltip-default';
      mapitem.bindTooltip(item.name, { permanent: true, direction: "center", className: cls });
    }
    mapitem.addTo(lGrp);
  }

  private getGroup(groupId: string): MarkerGroup {
    let group = this.groups.find(g => g.id == groupId)
    if (!group) {
      group = new MarkerGroup()
      group.id = groupId
      this.groups.push(group)
    }

    let lGrp = this.lGroups.get(groupId)
    if (!lGrp) {
      lGrp = L.featureGroup();
      this.lGroups.set(groupId, lGrp)
    }

    if (!this._map.hasLayer(lGrp) && !this.mapPrefs.isHiddenGroup(this._mapCfg.id, groupId)) {
      lGrp.on('click', this.onAnnotationClick, this)
      lGrp.addTo(this.allMarkersLayer)
    }
    return group
  }

  private removeAnnotation(item: Annotation) {
    let groupId = item.group || DataService.UNCATEGORIZED
    let group = this.groups.find(g => g.id == groupId)
    if (group) {
      let indx = group._annotations.findIndex(a => a.id == item.id)
      if (indx >= 0) {
        let removed = group._annotations.splice(indx, 1)
        if (removed && removed.length > 0 && removed[0].getAttachment()) {
          removed[0].getAttachment().remove()
        }
      }
    }
  }

  private addOrUpdateGroup(grp: MarkerGroup) {
    // Check that this is not hidden and that the current user can view it
    if (!this.mapPrefs.isHiddenGroup(this._mapCfg.id, grp.id) && this.data.canView(grp)) {
      let indx = this.groups.findIndex(g => g.id == grp.id)
      if (indx >= 0) {
        this.groups[indx] = grp
      } else {
        this.groups.push(grp)
      }

      let lGrp = this.lGroups.get(grp.id)
      if (!lGrp) {
        lGrp = L.featureGroup();
        this.lGroups.set(grp.id, lGrp)
      }
      lGrp['title'] = grp.name

      if (!this._map.hasLayer(lGrp)) {
        lGrp.addTo(this.allMarkersLayer)
        lGrp.on('click', this.onAnnotationClick, this)
      }
    }
  }

  private removeGroup(grp: MarkerGroup) {
    let indx = this.groups.findIndex(g => g.id == grp.id)
    let lGrp = this.lGroups.get(grp.id)
    if (lGrp && this._map.hasLayer(lGrp)) {
      lGrp.remove()
    }
  }

  private clearLayerGroups() {
    this.groups.splice(0)
    this.allMarkersLayer.clearLayers()
    this.lGroups.clear()
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
    let a: MarkerTypeAnnotation = <MarkerTypeAnnotation>Annotation.fromLeaflet(marker)
    if (a) {
      let icn = this.iconCache.getIcon(a.markerType, zoomLevel)
      if (icn) {
        marker.setIcon(icn)
      } else {
        this.markerZoomLog.debug(`NOT Updating Icon ${a.markerType} at zoom : ${zoomLevel}`)
      }
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
    this.router.navigate(['/map/' + mapId])
  }

  /**
   * Set the map config
   * @param mapCfg 
   */
  private setConfig(mapCfg: MapConfig) {
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
    this.router.navigate(['/'])
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
    if (m.id == 'TEMP') {
      m.id = UUID.UUID().toString()
    }
    if (ImageAnnotation.is(m) && m._saveImage) {
      this.data.saveImageAnnotation(m)
    } else {
      this.data.save(m)
    }
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