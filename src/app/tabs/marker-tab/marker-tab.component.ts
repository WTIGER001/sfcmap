import { Component, OnInit, NgZone, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MapService } from '../../map.service';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { MapConfig, MarkerGroup, MergedMapType, Selection } from '../../models';
import { RestrictService } from '../../dialogs/restrict.service';
import { DataService } from '../../data.service';
import { UUID } from 'angular2-uuid';
import { Map as LeafletMap, LeafletMouseEvent, circle } from 'leaflet';
import { CalibrateX } from '../../leaflet/calibrate';
import { DialogService } from '../../dialogs/dialog.service';
import { Format } from '../../util/format';
import { EditShapeComponent } from '../../controls/edit-shape/edit-shape.component';
import { Annotation, ShapeAnnotation, MarkerTypeAnnotation, ImageAnnotation } from '../../models';
import { EditMarkerComponent } from '../../controls/edit-marker/edit-marker.component';

@Component({
  selector: 'app-marker-tab',
  templateUrl: './marker-tab.component.html',
  styleUrls: ['./marker-tab.component.css']
})
export class MarkerTabComponent implements OnInit {
  @ViewChild('editshape') editShape: EditShapeComponent
  @ViewChild('editmarker') editMarker: EditMarkerComponent


  item: Annotation

  markers: Annotation

  edit = false
  map: MapConfig

  // categories = []

  groups: MarkerGroup[] = []

  // ready = new Map<string, boolean>()

  restricted = false

  merged: MergedMapType[] = []
  leafletMap: LeafletMap
  ruler: number[] = [4]
  selection: Selection = new Selection([])

  calibrateX: CalibrateX

  constructor(private mapSvc: MapService, private CDialog: CommonDialogService, private restrict: RestrictService, private data: DataService, private dialog: DialogService, private zone: NgZone) {
    this.data.mapTypesWithMaps.subscribe(items => {
      this.merged = items
    })

    this.mapSvc.mapConfig.subscribe(m => this.map = m)

    this.mapSvc.map.subscribe(m => {
      this.leafletMap = m
    })

    // Handle Selections
    this.mapSvc.selection.subscribe(sel => {
      this.processSelection(sel)
    })

    // Needed for name resolution
    this.mapSvc.completeMarkerGroups.subscribe(
      groups => this.groups = groups
    )

    // this.data.categories.subscribe(categories => {
    //   this.categories = categories
    // })
  }

  pan() {
    if (this.item !== undefined) {
      this.mapSvc.panTo(this.item.center())
    }
  }

  public itemType(item: Annotation): string {
    if (ShapeAnnotation.is(item)) {
      return 'shape'
    }
    if (MarkerTypeAnnotation.is(item)) {
      return 'marker'
    }
    if (ImageAnnotation.is(item)) {
      return 'image'
    }
    throw new Error("Invalid Item")
  }

  private isMouseEvent(event: any): event is LeafletMouseEvent {
    return true
  }

  ngOnInit() {
  }

  public deselect() {
    this.mapSvc.select();
  }

  public newMarker() {
    let m = this.mapSvc.newTempMarker()
    this.processSelection(new Selection([m]))
    this.restricted = false
    this.editstart()
  }

  public newPolyline() {
    let s = new ShapeAnnotation('polyline')
    s.name = "New Polyline"
    let shp = this.mapSvc._map.editTools.startPolyline()
    s.setAttachment(shp)
    this.completeShape(s)
  }

  public newCircle() {

    let s = new ShapeAnnotation('circle')
    s.name = "New Circle"
    let shp = this.mapSvc._map.editTools.startCircle()
    shp.addTo(this.mapSvc.newMarkersLayer)
    s.setAttachment(shp)
    this.completeShape(s)
  }

  public newRectangle() {
    let s = new ShapeAnnotation('rectangle')
    s.name = "New Rectangle"
    let shp = this.mapSvc._map.editTools.startRectangle()
    s.setAttachment(shp)
    this.completeShape(s)
  }

  public newPolygon() {
    let s = new ShapeAnnotation('polygon')
    s.name = "New Polygon"
    let shp = this.mapSvc._map.editTools.startPolygon();
    s.setAttachment(shp)
    this.completeShape(s)
  }

  private completeShape(s: ShapeAnnotation) {
    s.id = 'TEMP'
    s.map = this.map.id
    s.copyOptionsFromShape()

    s.getAttachment().on('click', event => {
      console.log("CLICKED ON  : ", event);
      this.mapSvc.printLayers()
      console.log("------>> ", event.target.getLeafletId());

    }, this)


    this.selection = new Selection([s])
    this.item = s
    this.edit = true
  }

  name(m: Annotation): string {
    let mk = this.groups.find(grp => grp.id == m.group)
    if (mk) {
      return mk.name
    }
    return 'Ugh....'
  }

  coords(m: Annotation): string {
    let ll = m.center()
    return ll.lng.toFixed(1) + ", " + ll.lat.toFixed(1)
  }

  mapId() {
    return this.map.id
  }

  public editstart() {
    if (this.item !== undefined) {
      this.edit = true
      this.enableDragging()
    }
  }

  public cancel() {
    this.edit = false
    this.disableDragging()
    if (ShapeAnnotation.is(this.item)) {
      this.item.asItem().disableEdit()
      this.mapSvc._map.editTools.featuresLayer.clearLayers()
    }
    this.mapSvc.newMarkersLayer.clearLayers()

    if (this.item.id == "TEMP") {
      this.item.getAttachment().remove()
      this.processSelection(new Selection([]))
    }
  }

  public save() {
    this.edit = false
    this.disableDragging()
    this.selection.items.forEach(m => {
      if (m.id == 'TEMP') {
        m.id = UUID.UUID().toString()
      }
      this.saveItem(m)
    })
  }

  private saveItem(item: ShapeAnnotation) {
    // Update the Group 
    let typeId = this.getGroupOrCreateId(item.group)
    item.group = typeId

    // Disable the editing and dragging
    item.getAttachment().disableEdit()
    item.getAttachment().dragging.disable()

    // Copy the points that could have been updated while the user was dragging
    item.copyPoints()

    // Save the shape
    // this.editShape.save()
    this.mapSvc.saveAnnotation(item)

    // Clear the temporary shape
    this.mapSvc.newMarkersLayer.clearLayers()
  }

  getGroupOrCreateId(markerGroupIdOrName: string) {
    let typeId = ''
    if (markerGroupIdOrName) {
      let type = this.groups.find(mg => mg.id == markerGroupIdOrName)
      if (type == undefined) {
        type = new MarkerGroup()
        type.id = UUID.UUID().toString()
        type.name = markerGroupIdOrName
        type.map = this.map.id
        this.data.save(type)
      }
      typeId = type.id
    }
    return typeId
  }

  //TODO: Move to MapSvcAction
  public delete() {
    if (this.item != undefined) {
      let names = []
      this.selection.items.forEach(m => {
        if (Annotation.is(m)) {
          names.push(m.name)
        }
      })
      let namesTxt = Format.formatArray(names)
      this.CDialog.confirm("Are you sure you want to delete " + namesTxt + "?", "Confirm Delete").subscribe(result => {
        if (result) {
          this.selection.items.forEach(m => {
            if (Annotation.is(m)) {
              this.mapSvc.deleteAnnotation(m)
            }
          })
          this.edit = false
          this.mapSvc.newMarkersLayer.clearLayers()
          this.processSelection(new Selection([]))
        }
      })
    }
  }

  public openLinkedMap() {
    if (this.item && this.item.mapLink) {
      this.mapSvc.openMap(this.item.mapLink)
    }
  }

  public permissions() {
    if (this.item) {
      this.restrict.openRestrict(this.item.view, this.item.edit).subscribe(([view, edit]) => {
        if (this.data.canEdit(this.item)) {
          let items = []
          this.selection.items.forEach(m => {
            this.item.edit = edit
            this.item.view = view
            this.mapSvc.saveAnnotation(this.item)
          })
        }
      })
    }
  }

  private processSelection(newSelection: Selection) {
    this.disableDragging()
    this.selection = newSelection
    this.restricted = this.isRestricted()
    this.item = this.firstAnnotation()
    if (this.item) {
      this.markers = this.item
    }
    this.edit = false
  }

  public types(): string {
    const all = new Map<string, boolean>()
    const myTypes: string[] = []
    this.selection.items.forEach(i => all.set(this.itemType(i), true))
    all.forEach((v, k) => myTypes.push(k))
    return myTypes.join("|")
  }

  private firstAnnotation(): Annotation {
    return this.selection.items[0]
  }

  private isRestricted(): boolean {
    let r = false
    this.selection.items.forEach(m => {
      r = r || this.data.isRestricted(m)
    })
    return r
  }

  private disableDragging() {
    this.selection.items.forEach(m => {
      let annotation = <Annotation>m
      let leafletAttachment = annotation.getAttachment()
      if (leafletAttachment.dragging) {
        leafletAttachment.dragging.disable()
      }
      if (ShapeAnnotation.is(m)) {
        this.item.getAttachment().disableEdit()
      }
    })
  }

  private enableDragging() {
    this.selection.items.forEach(m => {
      let annotation = <Annotation>m
      if (annotation.getAttachment().dragging) {
        annotation.getAttachment().dragging.enable()
      }
      if (ShapeAnnotation.is(m)) {
        m.getAttachment().enableEdit()
      }
    })
  }

  public updateMuliEdit() {

  }
}


