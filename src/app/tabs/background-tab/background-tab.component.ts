import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { MapService } from 'src/app/maps/map.service';
import { TokenPack } from 'src/app/maps/token';
import { ImageAnnotation, TokenAnnotation, Annotation, ShapeAnnotation, BarrierAnnotation, MarkerTypeAnnotation, MarkerGroup, MapConfig } from 'src/app/models';
import * as _ from 'lodash'
import { Marker, Util } from 'leaflet';
import { GridLayer } from 'src/app/leaflet/grid';
import { UUID } from 'angular2-uuid';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-background-tab',
  templateUrl: './background-tab.component.html',
  styleUrls: ['./background-tab.component.css']
})
export class BackgroundTabComponent implements OnInit {
  packs 
  mapItems: BackgroundItems
  editmode = false
  grid: GridLayer
  groups: MarkerGroup[] = []
  map: MapConfig
  
  constructor(private data : DataService, private mapSvc : MapService) { 
    this.mapItems = new BackgroundItems()
    this.mapItems.name = "In Map"

    this.packs = [this.mapItems]
    this.grid = new GridLayer(this.mapSvc)

    this.mapSvc.mapConfig.subscribe(m => {
      this.map = m
      if (m.gridOptions) {
        Util.extend(this.grid.options, m.gridOptions)
      }
      this.data.gameAssets.annotationFolders.items$.pipe(
        map(items => items.filter(i => i.map == m.id))
      ).subscribe(items => this.groups = items)
    })
  }

  ngOnInit() {
    this.mapSvc.annotationAddUpate.subscribe(a => this.calcMapItems())
    this.mapSvc.annotationDelete.subscribe(a => this.calcMapItems())
  }

  updateMyTokens() {

  }

  toggleEdit() {
    if (this.editmode) {
      this.finishEdit()
    } else {
      this.startEdit()
    }
  }

  startEdit() {
    console.log("Starting Edit")
    this.editmode = true
    const annotations = this.mapSvc.annotationsFromMap()
    const bg = annotations.filter( a => a.background)
    bg.forEach( a => {
      this.beginDragging(a)
    })
  }

  finishEdit() {
    console.log("Ending Edit")
    this.editmode = false
    const annotations = this.mapSvc.annotationsFromMap()
    const bg = annotations.filter(a => a.background)
    bg.forEach(a => {
      this.disableDragging(a)
    })
  }

  beginDragging(m: Annotation) {
    // console.log("BEGINNING DRAG")
    if (m.getAttachment().dragging) {
      m.getAttachment().dragging.enable()
    }
    if (ShapeAnnotation.is(m) || ImageAnnotation.is(m) || BarrierAnnotation.is(m)) {
      m.getAttachment().enableEdit()
      m.getAttachment().on('editable:drawing:move', this.snapVertexToGrid, this)
      m.getAttachment().on('drag', this.snapShapeToGrid, this)
      m.getAttachment().on('dragend', this.dropsave, this)
    }
    if (TokenAnnotation.is(m)) {
      m.getAttachment().enableEdit()
      m.getAttachment().on('editable:drawing:move', this.snapVertexToGrid, this)
      m.getAttachment().on('drag', this.snapShapeToGrid, this)
      m.getAttachment().on('dragend', this.dropsave, this)
    }
    if (MarkerTypeAnnotation.is(m)) {
      m.getAttachment().on('drag', this.snapMarkerToGrid, this)
      m.getAttachment().on('dragend', this.dropsave, this)
    }
  }

  private disableDragging(m:Annotation) {
    let annotation = <Annotation>m
    let leafletAttachment = annotation.getAttachment()
    if (leafletAttachment.dragging) {
      leafletAttachment.dragging.disable()
    }
    if (ShapeAnnotation.is(m) || ImageAnnotation.is(m) || TokenAnnotation.is(m)) {
      if (m.getAttachment()) {
        if (m.getAttachment().disableEdit) {
          m.getAttachment().disableEdit()
        }
        m.getAttachment().off('editable:drawing:move', this.snapVertexToGrid, this)
        m.getAttachment().off('drag', this.snapShapeToGrid, this)
      }
    }
    if (MarkerTypeAnnotation.is(m)) {
      annotation.getAttachment().off('drag', this.snapMarkerToGrid, this)
    }
    m.getAttachment().off('dragend', this.dropsave, this)
  }

  private snapMarkerToGrid(e) {
    const m = <Marker>e.target
    const ann = <MarkerTypeAnnotation>m['objAttach']
    if (ann.snap) {
      let bnds = this.grid.getGridCell(e.latlng)
      let snapPoint = bnds.getCenter()
      m.setLatLng(snapPoint)
    }
  }

  private snapVertexToGrid(e) {
    const m = e.target
    const ann = <ShapeAnnotation>m['objAttach']
    if (((ShapeAnnotation.is(ann) && ann.type == 'rectangle') || ImageAnnotation.is(ann) || TokenAnnotation.is(ann)) && ann.snap) {
      if (e.vertex) {
        let vertex = this.grid.getGridVertex(e.latlng)
        e.vertex.editor.__snap_latLng = vertex
      }
    }
  }
  private snapShapeToGrid(e) {
    const m = e.target
    const ann = <ShapeAnnotation>m['objAttach']

    if (((ShapeAnnotation.is(ann) && ann.type == 'rectangle') || ImageAnnotation.is(ann) || TokenAnnotation.is(ann)) && ann.snap) {
      const last = this.mapSvc.mouseCoord
      const ann = <ShapeAnnotation>m['objAttach']
      const newBounds = this.grid.snapBounds(m.getBounds(), last)
      m.setBounds(newBounds)
    }
  }

  private dropsave(e) {
    const m = e.target
    const ann = <ShapeAnnotation>m['objAttach']
    this.saveItem(ann)
  }

  private saveItem(item: ShapeAnnotation | ImageAnnotation | TokenAnnotation | BarrierAnnotation) {
    // Update the Group 
    let typeId = this.getGroupOrCreateId(item.group)
    item.group = typeId

    // Disable the editing and dragging
    if (item.getAttachment() && item.getAttachment().disableEdit) {
      item.getAttachment().disableEdit()
    }

    if (item.getAttachment() && item.getAttachment().dragging && item.getAttachment().dragging.disable) {
      item.getAttachment().dragging.disable()
    }

    // Copy the points that could have been updated while the user was dragging
    item.copyPoints()

    // Save the shape
    // this.editShape.save()
    this.mapSvc.saveAnnotation(item)

    // Clear the temporary shape
    // try {
    //   this.mapSvc._map.editTools.featuresLayer.clearLayers()
    // } catch (error) {

    // }
    this.mapSvc.newMarkersLayer.clearLayers()
  }


  getGroupOrCreateId(markerGroupIdOrName: string) {
    let typeId = ''
    if (markerGroupIdOrName) {
      let type = this.groups.find(mg => mg.id == markerGroupIdOrName)
      if (type == undefined) {
        type = new MarkerGroup()
        type.owner = this.data.game.value.id
        type.id = UUID.UUID().toString()
        type.name = markerGroupIdOrName
        type.map = this.map.id
        this.data.save(type)
      } else {

      }
      typeId = type.id
    }
    return typeId
  }

  calcMapItems() {
    console.log("Getting Background Annotations from Map")
    const annotations = this.mapSvc.annotationsFromMap()
    console.log("All", annotations)
    console.log("BG", annotations.filter(a => a.background))
    const bg = annotations
      .filter( a => a.background)
      // .filter( a => ImageAnnotation.is(a) || TokenAnnotation.is(a))
    const all = _.unionWith(bg, (a, b) => {
      if (ImageAnnotation.is(a) && ImageAnnotation.is(b)) {
        return a.url == b.url
      }
      if (TokenAnnotation.is(a) && TokenAnnotation.is(b)) {
        return a.itemId == b.itemId
      }
      return false
    })
    
    console.log("ALL", all)
    this.mapItems.tokens = all
  }

  select(item) {

  }

  isSelected(item) : boolean {
    return false
  }

  pic(item) : string {
    if (ImageAnnotation.is(item) ) {
      return item.url 
    }
    if (TokenAnnotation.is(item)) {
      return item.url
    }
    return ""
  }
  caption(item) {
    return item.name
  }
}

class BackgroundItems {
  name: string
  tokens: Annotation[] = []
}
