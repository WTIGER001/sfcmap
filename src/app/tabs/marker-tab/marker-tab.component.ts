import { Component, OnInit, NgZone, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MapService } from '../../map.service';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { MapConfig, MarkerGroup, MergedMapType, Selection } from '../../models';
import { RestrictService } from '../../dialogs/restrict.service';
import { DataService } from '../../data.service';
import { UUID } from 'angular2-uuid';
import { Map as LeafletMap, LeafletMouseEvent } from 'leaflet';
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

  type = 'shape'

  edit = false
  map: MapConfig
  categories = []
  groups: MarkerGroup[] = []
  ready = new Map<string, boolean>()
  restricted = false
  merged: MergedMapType[] = []
  leafletMap: LeafletMap
  ruler: number[] = [4]
  selection: Selection = new Selection([])
  calibrateX: CalibrateX

  svgelement: ElementRef

  @ViewChild('svgdisplay') set content(content: ElementRef) {
    console.log("Setting SVG DISPLAY ", content);
    this.svgelement = content;
    this.insertSVG()
  }

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

    // Get Data
    this.mapSvc.completeMarkerGroups.subscribe(
      groups => this.groups = groups
    )

    this.data.categories.subscribe(categories => {
      this.categories = categories
    })
  }



  pan() {
    if (this.item !== undefined) {
      this.mapSvc.panTo(this.item.center())
    }
  }

  viewbox() {
    if (ShapeAnnotation.is(this.item)) {
      let d = this.item.asItem().getElement().getAttribute("d")
      let mod = d.replace(/[^0-9]+/g, " ").trim()
      let parts = mod.split(" ")

      let minX: number = parseInt(parts[0])
      let maxX: number = parseInt(parts[0])
      let minY: number = parseInt(parts[1])
      let maxY: number = parseInt(parts[1])
      for (let i = 2; i < parts.length; i += 2) {
        let x: number = parseInt(parts[i])
        let y: number = parseInt(parts[i + 1])
        maxX = Math.max(x, maxX)
        maxY = Math.max(y, maxY)
        minX = Math.min(x, minX)
        minY = Math.min(y, minY)
      }
      let result = minX + " " + minY + " " + (maxX - minX) + " " + (maxY - minY)
      console.log("VIEWBOX ", d, mod, parts, result);
      return result
    }
    return "0 0 200 100"
  }

  dynamicHeight() {
    if (ShapeAnnotation.is(this.item)) {
      let d = this.item.asItem().getElement().getAttribute("d")
      let mod = d.replace(/[^0-9]+/g, " ").trim()
      let parts = mod.split(" ")

      let minX: number = parseInt(parts[0])
      let maxX: number = parseInt(parts[0])
      let minY: number = parseInt(parts[1])
      let maxY: number = parseInt(parts[1])
      for (let i = 2; i < parts.length; i += 2) {
        let x: number = parseInt(parts[i])
        let y: number = parseInt(parts[i + 1])
        maxX = Math.max(x, maxX)
        maxY = Math.max(y, maxY)
        minX = Math.min(x, minX)
        minY = Math.min(y, minY)
      }
      let deltaX = (maxX - minX)
      let deltaY = (maxY - minY)
      let aspect = deltaY / deltaX
      return Math.min(200 * aspect, 150)
    }
    return 100
  }

  private insertSVG() {
    if (this.item && ShapeAnnotation.is(this.item)) {
      let element = this.item.asItem().getElement()
      let el = this.svgelement.nativeElement

      let copy = element.cloneNode(true)
      el.appendChild(copy)
    }
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
    this.type = 'marker'
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
    s.id = UUID.UUID().toString()
    s.map = this.map.id
    s.copyOptionsFromShape()

    this.item = s
    this.edit = true
    this.type = 'shape'
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
    console.log("Edit Start - 1");
    if (this.item !== undefined) {
      this.edit = true
      console.log("Edit Start - 2");
      this.enableDragging()
      console.log("Edit Start - 3");
      if (ShapeAnnotation.is(this.item)) {
        this.item.asItem().enableEdit()
        this.type = 'shape'
      }
      if (MarkerTypeAnnotation.is(this.item)) {
        this.type = 'marker'
      }
      if (ImageAnnotation.is(this.item)) {
        this.type = 'image'
      }
    }
    console.log("Edit Start - 4");
  }

  public cancel() {
    this.edit = false
    this.disableDragging()
    if (ShapeAnnotation.is(this.item)) {
      this.item.asItem().disableEdit()
    }
    this.item.getAttachment().remove()

    if (this.item.id == "TEMP") {
      this.processSelection(new Selection([]))
    }
  }

  public save() {
    this.edit = false
    this.disableDragging()

    if (this.type == 'marker') {
      this.saveMarker()
    } else if (this.type == 'shape') {
      this.saveShape()
    }

    this.mapSvc.newMarkersLayer.clearLayers()
  }

  private saveShape() {
    // Update the Group 
    let typeId = this.getGroupOrCreateId(this.item.group)
    this.item.group = typeId

    // Disable the editing and dragging
    this.item.getAttachment().disableEdit()
    this.item.getAttachment().dragging.disable()

    // Copy the points that could have been updated while the user was dragging
    this.item.copyPoints()

    // Save the shape
    this.editShape.save()

    // Clear the temporary shape
    this.mapSvc.newMarkersLayer.clearLayers()
  }

  private saveMarker() {
    if (this.selection.items.length > 1) {
      // Find and create the markergroup if needed
      let typeId = this.getGroupOrCreateId(this.markers.group)

      // Apply the changes to each
      this.selection.items.forEach(m => {
        if (Annotation.is(m)) {
          m.group = typeId
          if (MarkerTypeAnnotation.is(m)) {
            // m.markerType =  this.markers.m
          }
          this.mapSvc.saveAnnotation(m)
        }
      })
    } else {
      let typeId = this.getGroupOrCreateId(this.item.group)
      this.item.group = typeId
      this.item.copyPoints()

      this.mapSvc.saveAnnotation(this.item)
    }

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
    console.log("SELECTION ", newSelection);
    this.disableDragging()
    this.selection = newSelection
    this.restricted = this.isRestricted()
    this.item = this.firstAnnotation()
    if (this.item) {
      this.markers = this.item
      if (MarkerTypeAnnotation.is(this.item)) {
        this.type = 'marker'
      }
      if (ShapeAnnotation.is(this.item)) {
        this.type = 'shape'
      }
    }
    this.edit = false
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
      if (m.dragging) {
        m.dragging.disable()
      }
    })
  }

  private enableDragging() {
    console.log("DRAGGING: ", this.selection);

    this.selection.items.forEach(m => {
      console.log("ENABLE DRAGGING: ", m);
      let annotation = <Annotation>m
      let leafletAttachment = annotation.getAttachment()
      if (leafletAttachment.dragging) {
        leafletAttachment.dragging.enable()
      }
    })
  }

  public updateMuliEdit() {

  }
}


