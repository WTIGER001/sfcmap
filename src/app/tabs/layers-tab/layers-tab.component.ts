import { Component, } from '@angular/core';
import { MapService } from '../../maps/map.service';
import { Map as LeafletMap, LayerGroup, Marker, Map } from 'leaflet';
import { map, tap, mergeMap } from 'rxjs/operators';
import { MapConfig, MarkerGroup, User, MapPrefs, Annotation, Selection, ImageAnnotation, MarkerTypeAnnotation, ShapeAnnotation, BarrierAnnotation, TokenAnnotation, Character, MarkerCategory } from '../../models';
import { DataService } from '../../data.service';
import { combineLatest, of } from 'rxjs';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { RestrictService } from '../../dialogs/restrict.service';
import { UUID } from 'angular2-uuid';
import { Monster } from 'src/app/monsters/monster';
import { Token } from 'src/app/maps/token';

@Component({
  selector: 'app-layers-tab',
  templateUrl: './layers-tab.component.html',
  styleUrls: ['./layers-tab.component.css']
})
export class LayersTabComponent {
  // Flag to indicate if edit mode is enabled
  edit = false

  // Layer that is selected, can be undefined for no selection
  layer: MarkerGroup

  // flag indicating if this object has restrictions
  restricted = false

  // Object to track collapsed state. Each id is a propery name and the property value is a boolean
  isCollapsed = {}

  // The current user
  user: User
  mapPrefs: MapPrefs

  // The current leaflet map
  map: LeafletMap

  // The current map config
  mapConfig: MapConfig

  // All the known groups for the current map
  groups: MarkerCategory[] = []

  // Item that is currently being dragged. This can be either a Marker Group or an Annotation item
  dragging

  // Cache of the groups that are shown from the users selection
  _shownGroups = []

  // Cache of the annotations that are shown from the users selection
  _shownMarkers = []

  // Shows the empty groups in the
  showEmpty = true

  annotations: Annotation[] = []

  selection: Selection = new Selection([])

  constructor(private mapSvc: MapService, private data: DataService, private dialog: CommonDialogService, private restrict: RestrictService) {
    this.mapSvc.map.subscribe(m => this.map = m)

    this.mapSvc.selection.subscribe(s => this.selection = s)

    this.mapSvc.annotationAddUpate.subscribe(a => this.calcMapItems())
    this.mapSvc.annotationDelete.subscribe(a => this.calcMapItems())
    this.data.gameAssets.markerCategories.items$.subscribe( g => this.groups = g)

    // this.data.userMapPrefs.pipe(
    //   tap(p => this.mapPrefs = p),
    //   mergeMap(p => this.mapSvc.mapConfig),
    //   tap(m => this.mapConfig = m)
    // ).subscribe(mapCfg => {
    //   this._shownGroups = this.mapPrefs.getMapPref(mapCfg.id).hiddenGroups || []
    //   this._shownMarkers = this.mapPrefs.getMapPref(mapCfg.id).hiddenMarkers || []
    // })

    // this.mapSvc.completeMarkerGroups.pipe(
    //   map(groups => {
    //     this.groups = groups
    //     this.groups.forEach(g => {
    //       if (!this.isCollapsed.hasOwnProperty(g.id)) {
    //         this.isCollapsed[g.id] = true
    //       }
    //     })
    //   })
    // ).subscribe(() => { })
  }
  trackById(index: number, item: any) {
    return item.id
  }
  calcMapItems() {
    this.annotations = this.mapSvc.annotationsFromMap()
    this.annotations[0].group
  }

  typeIcon(a: Annotation) {
    if (MarkerTypeAnnotation.is(a)) {
      return "map-marker-alt"
    }
    if (ShapeAnnotation.is(a)) {
      if (a.type == 'polyline') { return "signature" }
      if (a.type == 'polygon') { return 'draw-polygon' }
      if (a.type == 'rectangle') { return 'vector-square' }
      if (a.type == 'circle') {return ['far', 'circle'] }
    }
    if (ImageAnnotation.is(a)) {
      return 'image'
    }
    if (BarrierAnnotation.is(a)) {
      return 'rectangle-wide'
    }
    if (TokenAnnotation.is(a)) {
      if (a.itemType == Character.TYPE) { return 'user-shield'}
      if (a.itemType == Monster.TYPE) { return 'dragon'}
      if (a.itemType == Token.TYPE) { return 'helmet-battle'}
    }
    return "times"
  }

  visIcon(a: Annotation) {
    return 'eye'
  }

  newLayer() {
    let newLayer = new MarkerGroup()
    newLayer.id = 'TEMP'
    newLayer.name = "New Layer"
    newLayer.map = this.mapConfig.id
    this.layer = newLayer
    this.restricted = false
    this.editStart()
  }

  editStart() {
    if (this.layer) {
      this.edit = true
    }
  }

  permissions() {
    if (this.layer) {
      this.restrict.openRestrict(this.layer).subscribe((r) => {
        if (r) {
          this.data.save(this.layer)
          this.restricted = this.data.isRestricted(this.layer)
        }
      })
    }
  }

  delete() {
    if (this.layer) {
      this.dialog.confirm("Are you sure you want to delete " + this.layer.name + "? It has " + this.layer._annotations.length + " markers that will also be deleted.").subscribe(result => {
        if (result) {
          this.layer._annotations.forEach(m => {
            this.data.delete(m)
          })
          this.data.delete(this.layer)
          this.layer = undefined
        }
      })
    }
  }

  deselect() {
    this.layer = undefined
    this.edit = false
  }

  save() {
    if (this.layer) {
      if (this.layer.id == 'TEMP') {
        this.layer.id = UUID.UUID().toString()
      }
      this.data.save(this.layer)
    }
    this.edit = false
  }

  select(item: MarkerGroup) {
    if (this.isSelected(item)) {
      this.deselect()
    } else {
      this.layer = item
      this.restricted = this.data.isRestricted(this.layer)
    }
  }

  isSelected(item: MarkerGroup) {
    return (this.layer && this.layer.id == item.id)
  }

  isChecked(item: MarkerGroup): boolean {
    if (this.mapPrefs) {
      return !this.mapPrefs.isHiddenGroup(this.mapConfig.id, item.id)
    }
  }

  cancel() {
    this.edit = false
  }

  isFeatureGroup(item: any): item is LayerGroup {
    return item.eachLayer
  }

  isRestricted(item: any): boolean {
    return this.data.isRestricted(item)
  }

  groupCheckChange($event) {
    if (this.mapPrefs) {
      let mPrefs = this.mapPrefs.getMapPref(this.mapConfig.id)
      if ($event) {
        mPrefs.hiddenGroups = $event
        this.data.save(this.mapPrefs)
      } else {
        console.log("BADDD - mPrefs.hiddenGroups is undefined");
      }
    }
  }

  markerCheckChange($event) {
    if (this.mapPrefs) {
      let mPrefs = this.mapPrefs.getMapPref(this.mapConfig.id)
      if ($event) {
        mPrefs.hiddenMarkers = $event
        this.data.save(this.mapPrefs)
      } else {
        console.log("BADDD - mPrefs.hiddenMarkers is undefined");
      }
    }
  }

  set shownGroups(v: any[]) {
    this._shownGroups = v
    this.groupCheckChange(v)
  }

  set shownMarkers(v: any[]) {
    this._shownMarkers = v
    this.markerCheckChange(v)
  }

  get shownGroups(): any[] {
    return this._shownGroups
  }

  get shownMarkers(): any[] {
    return this._shownMarkers
  }

  drop(item: Annotation | MarkerGroup, group: MarkerGroup) {
    if (MarkerGroup.is(item) && group.id != item.id) {
      let gid = group.id == DataService.UNCATEGORIZED ? '' : group.id
      item._annotations.forEach(m => {
        m.group = gid
        this.data.save(m)
      })
      this.data.delete(group)
    }
    if (Annotation.is(item) && item.group != group.id) {
      if (group.id == DataService.UNCATEGORIZED && item.group != '') {
        item.group = ''
        this.data.save(item)
      }

      if (group.id != DataService.UNCATEGORIZED) {
        item.group = group.id
        this.data.save(item)
      }
    }
  }

  isAnnotationChecked(item: Annotation): boolean {
    if (this.mapPrefs) {
      return !this.mapPrefs.isHiddenMarker(this.mapConfig.id, item.id)
    }
  }

  toggleAnnotation(item: Annotation) {
    if (this.isAnnotationChecked(item)) {
      this._shownMarkers.push(item.id)
    } else {
      let indx = this._shownMarkers.indexOf(item.id)
      this._shownMarkers.splice(indx)
    }
    this.markerCheckChange(this._shownMarkers)
  }

  toggleGroup(item: MarkerGroup) {
    if (this.isChecked(item)) {
      this._shownGroups.push(item.id)
    } else {
      let indx = this._shownGroups.indexOf(item.id)
      this._shownGroups.splice(indx)
    }
    this.groupCheckChange(this._shownGroups)
  }

  selectAnnotation(item: Annotation) {
    this.mapSvc.select(item)
  }

  isAnnotationSelected(item: Annotation): boolean {
    return this.selection.items.includes(item)
  }
}
