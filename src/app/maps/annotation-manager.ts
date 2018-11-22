import { mergeMap, concatMap, map, buffer, bufferCount, take, first, debounceTime, pairwise } from 'rxjs/operators';
import { ReplaySubject, combineLatest, BehaviorSubject, of } from 'rxjs';
import { Map as LeafletMap, DomUtil, Marker, LayerGroup, featureGroup, Layer, layerGroup, ImageOverlay } from "leaflet";
import { MapConfig, Annotation, MarkerTypeAnnotation, Operation, IconZoomLevelCache, MapPrefs, MarkerGroup, MarkerType, TokenAnnotation, ImageAnnotation, Selection } from "../models";
import { DataService } from "../data.service";
import { MapService } from "./map.service";
import { NgZone, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
import { NotifyService, Debugger } from '../notify.service';
import { HtmlUtil } from '../util/html-util';
import { AnnotationFactory } from './annotation-factory';

export class AnnotationManager {
  /** Icons (one per marker type) at each soom level for the map. This is precomputed so that zooming is quick. Note this is computed each time there is a map change  */
  iconCache: IconZoomLevelCache

 
  /** Array of all Marker Groups for this map. For each marker group there is an associated layer */
  groups: MarkerGroup[] = []

  /** Map of the LayerGroups that are used for each Marker Group. The key is the marker group id and there is a special layer there for the uncategorized markers */
  lGroups = new Map<string, L.FeatureGroup>()

  /** Preferences */
  mapPrefs: MapPrefs

  /** Marker Types */
  types = new Map<string, MarkerType>()

  // Trigger
  public completeMarkerGroups = new ReplaySubject<Array<MarkerGroup>>(1)

  public factory : AnnotationFactory

  log: Debugger
  mapLoad: Debugger
  markerZoomLog: Debugger
  constructor(
    private leafletmap: LeafletMap, private mapCfg: MapConfig, private data: DataService,
    private mapSvc: MapService, private zone: NgZone, private notify: NotifyService, 
    private allMarkersLayer: LayerGroup, private viewref: ViewContainerRef , private resolver: ComponentFactoryResolver) {
    console.log("SETUP ANNOTATION MANAGER");

    this.mapLoad = this.notify.newDebugger('Map Loading')
    this.markerZoomLog = this.notify.newDebugger('Marker Zoom')
    this.iconCache = new IconZoomLevelCache(this.markerZoomLog, this.mapLoad)
    this.factory = new AnnotationFactory(this.iconCache, this.resolver, this.viewref, [])

    // Get the user preferences
    this.data.userMapPrefs.subscribe(prefs => {
      this.mapPrefs = prefs
    })

    // Get all the annotation groups for this map it
    data.gameAssets.annotationFolders.items$.subscribe(items => this.groups = items)

    // Get all the marker types
    let makeMarkerTypes = this.data.gameAssets.markerTypes.items$.pipe(
      map(markertypes => {
        this.iconCache.load(markertypes, this.leafletmap)
        this.factory.markerTypes = markertypes
        this.types.clear()
        markertypes.forEach(type => {
          this.types.set(type.id, type)
        })
        return this.types
      }
      ))

    this.data.getCompleteAnnotationGroups(mapCfg.id).subscribe(groups => {
      console.log("Recieved new set of annotations, need to compare", groups)
      this.completeMarkerGroups.next(groups)
    })

    let loadGroups = this.completeMarkerGroups.pipe(
      map(groups => {
        this.groups = groups
        this.makeLayerGroups(groups)
        return groups
      })
    )

    combineLatest(makeMarkerTypes)
      .pipe().subscribe((value) => {
        this.clearLayerGroups()
        this.getAnnotationsAndGroups()
        this.reattachSelection(this.groups)
      })

    this.data.userMapPrefs.subscribe(prefs => {
      this.groups.forEach(grp => {
        this.ensureGroupVisibility(grp, !prefs.isHiddenGroup(this.mapCfg.id, grp.id))
        grp._annotations.forEach(a => {
          this.ensureAnnotationVisibility(a, grp, !prefs.isHiddenMarker(this.mapCfg.id, a.id))
        })
      })
    })

    this.mapSvc.selection.pipe(pairwise()).subscribe(s => this.styleSelection(s))

    this.addMapListers()
  }

  private addMapListers() {
    this.leafletmap.on('zoomend', () => {
      var currentZoom = this.leafletmap.getZoom();
      this.leafletmap.eachLayer(catLayer => {
        this.updateMarkerSizes(currentZoom, catLayer)
      })

      // Fix the selection class
      this.styleSelection()
    })
  }


  private ensureGroupVisibility(group: MarkerGroup, visible: boolean) {
    let layer = this.lGroups.get(group.id)
    if (layer) {
      if (visible && !this.leafletmap.hasLayer(layer)) {
        layer.addTo(this.leafletmap)
      } else if (!visible && this.leafletmap.hasLayer(layer)) {
        layer.remove()
      }
    } else {
      console.log(">>>No Layer... skipping")
    }
  }

  private ensureAnnotationVisibility(annotation: Annotation, group: MarkerGroup, visible: boolean) {
    // let item = annotation.toLeaflet(undefined)
    let item = this.factory.toLeaflet(annotation)
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

  loadAnnotations() {
    // Get the annotationgr


  }

  private getAnnotationsAndGroups() {
    const sub1 = this.data.getAnnotations$(this.mapCfg.id).subscribe(
      action => {
        // console.log("getAnnotationsAndGroups : getAnnotations$", action)
        if (action.op == Operation.Added || action.op == Operation.Updated) {
          this.addOrUpdateAnnotation(action.item)
          this.mapSvc.annotationAddUpate.next(action.item)
        } else if (action.op == Operation.Removed) {
          this.removeAnnotation(action.item)
          this.mapSvc.annotationDelete.next(action.item)
        }
      })
    const sub2 = this.data.getAnnotationGroups$(this.mapCfg.id).subscribe(
      action => {
        if (action.op == Operation.Added || action.op == Operation.Updated) {
          this.addOrUpdateGroup(action.item)
        } else if (action.op == Operation.Removed) {
          this.removeGroup(action.item)
        }
      })

  }


  private addOrUpdateAnnotation(item: Annotation) {
    // console.log("addOrUpdateAnnotation ", item.name)

    if (this.mapPrefs.isHiddenMarker(this.mapCfg.id, item.id)) {
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
      let mapitem = this.factory.toLeaflet(item)
      this.addAnnotationItem(mapitem, item, group, lGrp);
    }

    if (this.isSelected(item)) {
      this.highlight(item)
    }


  }

  private isSelected(item: any) {
    let sel = this.mapSvc.selection.getValue()
    if (!sel.isEmpty()) {
      const indx = sel.items.findIndex(i => i.id == item.id)
      return indx >= 0
    }
    return false
  }

  private addAnnotationItem(mapitem: any, item: Annotation, group: MarkerGroup, lGrp: L.FeatureGroup<any>) {
    mapitem['title'] = item.name;
    if (group.showText) {
      let cls = group.textStyle || 'sfc-tooltip-default';
      mapitem.bindTooltip(item.name, { permanent: true, direction: "center", className: cls });
    }
    if (TokenAnnotation.is(item)) {
      mapitem.en
    }
    try {
      mapitem.addTo(lGrp);
    } catch (error) {
      console.log(error)
      console.log("MAP ITEM", mapitem)
      console.log("ITEM", item.id, item)

    }
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
      lGrp = featureGroup();
      this.lGroups.set(groupId, lGrp)
    }

    if (!this.leafletmap.hasLayer(lGrp) && !this.mapPrefs.isHiddenGroup(this.mapCfg.id, groupId)) {
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
    if (!this.mapPrefs.isHiddenGroup(this.mapCfg.id, grp.id) && this.data.canView(grp)) {
      let indx = this.groups.findIndex(g => g.id == grp.id)
      if (indx >= 0) {
        this.groups[indx] = grp
      } else {
        this.groups.push(grp)
      }

      let lGrp = this.lGroups.get(grp.id)
      if (!lGrp) {
        lGrp = featureGroup();
        this.lGroups.set(grp.id, lGrp)
      }
      lGrp['title'] = grp.name

      if (!this.leafletmap.hasLayer(lGrp)) {
        lGrp.addTo(this.allMarkersLayer)
        lGrp.on('click', this.onAnnotationClick, this)
      }
    }
  }

  private removeGroup(grp: MarkerGroup) {
    let indx = this.groups.findIndex(g => g.id == grp.id)
    let lGrp = this.lGroups.get(grp.id)
    if (lGrp && this.leafletmap.hasLayer(lGrp)) {
      lGrp.remove()
    }
  }

  private clearLayerGroups() {
    this.groups.splice(0)
    this.allMarkersLayer.clearLayers()
    this.lGroups.clear()
  }

  private makeLayerGroups(mgs: MarkerGroup[]) {
    console.log("Making Groups, ", mgs.length)
    // Clear out the map
    this.lGroups.clear()

    // Create the new layers
    mgs.forEach(g => {
      let lg = featureGroup()
      lg['title'] = g.name
      lg.on('click', this.onAnnotationClick, this)
      this.lGroups.set(g.id, lg);
    });
  }

  /**
   * Add the necessary styleing to each marker that is selected
   */
  private styleSelection(selectionPair?: [Selection, Selection]) {
    let sel = this.mapSvc.selection.getValue()
    if (selectionPair) {
      // console.log('Selection Pair', selectionPair)
      if (!selectionPair[0].isEmpty()) {
        selectionPair[0].items.forEach(item => this.unhighlight(item))
      }
      sel = selectionPair[1]
    }
    if (!sel.isEmpty()) {
      sel.items.forEach(item => this.highlight(item))
    }
  }

  isMarker(obj: any): obj is Marker {
    return obj.options && obj.options.icon
  }

  isImageOverlay(obj: any): obj is ImageOverlay {
    return obj.options && obj.options.interactive
  }

  isLayerGroup(obj: any): obj is LayerGroup {
    return obj.eachLayer
  }

  private highlight(item: any) {
    // console.log("Selecting ", item)

    const domObj = this.getDomObject(item)
    if (domObj) {
      DomUtil.addClass(domObj, 'iconselected')
    }
    item['_selected'] = true
  }

  private unhighlight(item: any) {
    // console.log("Deselecting ", item)
    const domObj = this.getDomObject(item)
    if (domObj) {
      DomUtil.removeClass(domObj, 'iconselected')
    }
    item['_selected'] = false

  }

  private getDomObject(item: any): any {
    if (this.isMarker(item) && item["_icon"]) {
      return item["_icon"]
    } else if (MarkerTypeAnnotation.is(item) && item.getAttachment()["_icon"]) {
      return item.getAttachment()["_icon"]
    } else if (this.isImageOverlay(item)) {
      return item["_image"]
    } else if (TokenAnnotation.is(item) && item._leafletAttachment.getElement()) {
      return item._leafletAttachment.getElement()
    } else if (ImageAnnotation.is(item) && item._leafletAttachment._image) {
      return item._leafletAttachment._image
    }
    return undefined
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
      }
    }
  }

  private onAnnotationClick(event: any) {
    this.zone.run(() => {
      const leafletItem = event.layer
      const annotation = <Annotation>leafletItem.objAttach
      if (event.originalEvent.ctrlKey) {
        this.mapSvc.addToSelect(annotation)
      } else {
        this.mapSvc.select(annotation)
      }
    })
  }

  private reattachSelection(groups: MarkerGroup[]) {
    let sel = this.mapSvc.selection.getValue()
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
      this.mapSvc.selectForReattach(...items)
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


}