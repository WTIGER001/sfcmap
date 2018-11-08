import { Component, OnInit, NgZone, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MapService } from '../../maps/map.service';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { MapConfig, MarkerGroup, MergedMapType, Selection, Character, TokenAnnotation, BarrierAnnotation, Vision } from '../../models';
import { RestrictService } from '../../dialogs/restrict.service';
import { DataService } from '../../data.service';
import { UUID } from 'angular2-uuid';
import { Map as LeafletMap, LeafletMouseEvent, circle, Marker, Util, Path, Rectangle, latLng, latLngBounds } from 'leaflet';
import { CalibrateX } from '../../leaflet/calibrate';
import { DialogService } from '../../dialogs/dialog.service';
import { Format } from '../../util/format';
import { EditShapeComponent } from '../../controls/edit-shape/edit-shape.component';
import { Annotation, ShapeAnnotation, MarkerTypeAnnotation, ImageAnnotation } from '../../models';
import { EditMarkerComponent } from '../../controls/edit-marker/edit-marker.component';
import { GridLayer } from '../../leaflet/grid';
import { EditImageComponent } from '../../controls/edit-image/edit-image.component';
import { map, tap } from 'rxjs/operators';
import { CharacterService } from 'src/app/characters/dialogs/character.service';
import { LangUtil } from 'src/app/util/LangUtil';
import { Rect } from 'src/app/util/geom';
import { Token } from 'src/app/maps/token';
import { Monster } from 'src/app/monsters/monster';
import { SelectItemsComponent } from 'src/app/dialogs/select-items/select-items.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuraManager } from 'src/app/maps/aura-manager';
import { VisionEditComponent } from 'src/app/controls/vision-edit/vision-edit.component';

@Component({
  selector: 'app-marker-tab',
  templateUrl: './marker-tab.component.html',
  styleUrls: ['./marker-tab.component.css']
})
export class MarkerTabComponent implements OnInit {
  @ViewChild('editshape') editShape: EditShapeComponent
  @ViewChild('editmarker') editMarker: EditMarkerComponent
  @ViewChild('editimage') editImage: EditImageComponent


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
  grid: GridLayer
  lastmouse: LeafletMouseEvent
  selectionPinned = false
  auras: AuraManager

  constructor(private mapSvc: MapService, private CDialog: CommonDialogService,
    private restrict: RestrictService, private data: DataService, private modal: NgbModal, private zone: NgZone) {
    this.data.mapTypesWithMaps.subscribe(items => {
      this.merged = items
    })
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

    this.mapSvc.map.subscribe(m => {
      this.leafletMap = m
    })

    this.auras = new AuraManager(this.mapSvc, this.data)

    // Handle Selections
    this.mapSvc.selection.subscribe(sel => {
      this.processSelection(sel)
    })

    // // Needed for name resolution
    // this.mapSvc.completeMarkerGroups.subscribe(
    //   groups => this.groups = groups
    // )

    // this.data.categories.subscribe(categories => {
    //   this.categories = categories
    // })

    this.mapSvc.annotationAddUpate.pipe(
      tap(m => {
        if (TokenAnnotation.is(m)) {
          console.log("Added Token Annotation, making draggable")
          m.getAttachment().dragging.enable()
          m.getAttachment().on('editable:drawing:move', this.snapVertexToGrid, this)
          m.getAttachment().on('drag', this.snapShapeToGrid, this)
          m.getAttachment().on('dragend', this.dropsave, this)
        }
      })
    ).subscribe()
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
    if (TokenAnnotation.is(item)) {
      return 'token'
    }
    if (BarrierAnnotation.is(item)) {
      return 'barrier'
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

  public newImage() {
    let s = new ImageAnnotation()
    s.url = "./assets/missing.png"
    s.name = "New Image"
    let shp = this.mapSvc._map.editTools.startImage(s.url)
    s.setAttachment(shp)
    this.completeShape(s)
  }

  public newBarrier() {
    let s = new BarrierAnnotation()
    s.name = "Wall"
    let shp = this.mapSvc._map.editTools.startPolyline()
    s.setAttachment(shp)
    this.completeShape(s)
  }


  public addMonster() {
    // this.dialog.select(this.data.gameAssets.monsters.items$).subscribe(selected => {
    SelectItemsComponent.openDialog(this.modal, this.data.pathfinder.monsters$, { fields: Monster.FIELDS })
      .subscribe(selected => {
        selected.forEach((monster: Monster) => {
          // Add the character as a 'token' object (a subclass of the ImageAnnotation)
          this.addOneCharacter(monster)
        })
      })
  }

  public addToken() {
    SelectItemsComponent.openDialog(this.modal, this.data.gameAssets.tokens.items$).subscribe(selected => {
      selected.forEach((token: Token) => {
        this.addOneCharacter(token)
      })
    })
  }

  public addCharacter() {
    SelectItemsComponent.openDialog(this.modal, this.data.gameAssets.characters.items$).subscribe(selected => {
      selected.forEach((chr: Character) => {
        // Add the character as a 'token' object (a subclass of the ImageAnnotation)
        this.addOneCharacter(chr)
      })
    })
  }

  public addOneCharacter(item: Character | Monster | Token) {
    try {
      // Create the token with the basic information
      let s = new TokenAnnotation()
      s.name = item.name
      s.itemId = item.id
      s.itemType = item.objType
      if (Character.is(item)) {
        s.url = LangUtil.firstDefined(item.token, item.picture, './assets/missing.png')
      } else if (Monster.is(item)) {
        s.url = LangUtil.firstDefined(item.thumb, item.image, './assets/missing.png')
      } else if (Token.is(item)) {
        s.url = LangUtil.firstDefined(item.image, './assets/missing.png')
      }

      // Check if there are more of the same token on the map


      s.owner = this.data.game.value.id
      s.map = this.map.id

      // Determine the size of the token in pixeks
      const ppm = this.mapSvc._mapCfg.ppm
      const w = ppm * s.sizeX
      const h = ppm * s.sizeY

      // TODO: Not sure how to react to a token that is too small... Maybe make it a marker? and then rotate markers around the center?
      // Now place the token at the middle of the screen in the correct size and snapping into grid position (if there is a grid)
      let point = this.mapSvc.getCenter()
      let x1 = point.lng.valueOf() - s.sizeX / 2
      let x2 = point.lng.valueOf() + s.sizeX / 2
      let y1 = point.lat.valueOf() - s.sizeX / 2
      let y2 = point.lat.valueOf() + s.sizeX / 2
      let sw = latLng(y2, x1, 0)
      let ne = latLng(y1, x2, 0)
      let ll = latLngBounds(sw, ne)

      const newBounds = this.grid.snapBounds(ll, point)
      s.setBounds(newBounds)

      this.saveItem(s)
    } catch (error) {
    }
  }

  private completeShape(s: ShapeAnnotation | ImageAnnotation | BarrierAnnotation) {
    s.id = 'TEMP'
    s.map = this.map.id
    s.owner = this.data.game.value.id
    s.copyOptionsFromShape()

    // s.getAttachment().on('click', event => {
    //       //   this.mapSvc.printLayers()
    //   
    // }, this)

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
    if (m) {
      let ll = m.center()
      return ll.lng.toFixed(1) + ", " + ll.lat.toFixed(1)
    } else {
      return ''
    }
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
    if (ShapeAnnotation.is(this.item) || ImageAnnotation.is(this.item) || TokenAnnotation.is(this.item) || BarrierAnnotation.is(this.item)) {
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

  private saveItem(item: ShapeAnnotation | ImageAnnotation | TokenAnnotation | BarrierAnnotation) {
    // Update the Group 
    let typeId = this.getGroupOrCreateId(item.group)
    item.group = typeId

    // Disable the editing and dragging
    if (item.getAttachment() && item.getAttachment().disableEdit && item.getAttachment().dragging.disable) {
      item.getAttachment().disableEdit()
      item.getAttachment().dragging.disable()
    }

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

      if (TokenAnnotation.is(ann)) {
        this.auras.updateAuras(ann)
      }
    }
  }

  public openLinkedMap() {
    if (this.item && this.item.mapLink) {
      this.mapSvc.openMap(this.item.mapLink)
    }
  }

  permissions() {
    if (this.item) {
      this.restrict.openRestrict(this.item).subscribe((r) => {
        if (r) {
          this.data.save(this.item)
          this.restricted = this.data.isRestricted(this.item)
        }
      })
    }
  }

  togglePin() {
    this.selectionPinned = !this.selectionPinned
  }
  private processSelection(newSelection: Selection) {
    if (this.selectionPinned == false) {
      this.disableDragging()
      this.selection = newSelection
      this.restricted = this.isRestricted()
      this.item = this.firstAnnotation()
      if (this.item) {
        this.markers = this.item
      }

      if (this.selection.type && this.selection.type == 'edit') {
        this.edit = true
        this.enableDragging()
      } else {
        this.edit = false
      }

      if (this.item && TokenAnnotation.is(this.item)) {
        this.enableDragging()
      }
    }
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

  private dropsave(e) {
    const m = e.target
    const ann = <ShapeAnnotation>m['objAttach']
    this.saveItem(ann)
  }

  private getTokenItem(token: TokenAnnotation) {
    if (!token) {
      return undefined
    }

    if (token.itemType == Character.TYPE) {
      return this.data.gameAssets.characters.currentItems.find(c => c.id == token.itemId)
    }

    return undefined

  }


  private disableDragging() {
    this.selection.items.forEach(m => {
      let annotation = <Annotation>m
      let leafletAttachment = annotation.getAttachment()
      if (leafletAttachment.dragging) {
        leafletAttachment.dragging.disable()
      }
      if (ShapeAnnotation.is(m) || ImageAnnotation.is(this.item) || TokenAnnotation.is(this.item)) {
        if (this.item.getAttachment()) {
          if (this.item.getAttachment().disableEdit) {
            this.item.getAttachment().disableEdit()
          }
          this.item.getAttachment().off('editable:drawing:move', this.snapVertexToGrid, this)
          this.item.getAttachment().off('drag', this.snapShapeToGrid, this)
        }
      }
      if (MarkerTypeAnnotation.is(m)) {
        annotation.getAttachment().off('drag', this.snapMarkerToGrid, this)
      }
    })
  }

  private enableDragging() {
    this.selection.items.forEach(m => {
      this.beginDragging(m)
    })
  }

  beginDragging(m: Annotation) {
    console.log("BEGINNING DRAG")
    if (m.getAttachment().dragging) {
      m.getAttachment().dragging.enable()
    }
    if (ShapeAnnotation.is(m) || ImageAnnotation.is(this.item) || BarrierAnnotation.is(this.item)) {
      m.getAttachment().enableEdit()
      m.getAttachment().on('editable:drawing:move', this.snapVertexToGrid, this)
      m.getAttachment().on('drag', this.snapShapeToGrid, this)
    }
    if (TokenAnnotation.is(this.item)) {
      if (this.edit) {
        m.getAttachment().enableEdit()
      }
      m.getAttachment().on('editable:drawing:move', this.snapVertexToGrid, this)
      m.getAttachment().on('drag', this.snapShapeToGrid, this)
      m.getAttachment().on('dragend', this.dropsave, this)
    }
    if (MarkerTypeAnnotation.is(m)) {
      m.getAttachment().on('drag', this.snapMarkerToGrid, this)
    }
  }

  public updateMuliEdit() {

  }

  public tokenIsCharacter(item: TokenAnnotation) {
    return item.itemType == Character.TYPE
  }
  public tokenIsMonster(item: TokenAnnotation) {
    return item.itemType == Monster.TYPE
  }
  public tokenIsToken(item: TokenAnnotation) {
    return item.itemType == Token.TYPE
  }

  public xout() {
    // Create an exl
  }



  public addVision() {
    if (this.item && TokenAnnotation.is(this.item)) {
      this.item.vision = new Vision()
      this.save()
    }
  }

  public editVision() {
    if (this.item && TokenAnnotation.is(this.item)) {
      VisionEditComponent.open(this.modal, this.item.vision).subscribe(a => {
        this.save()
      })
    }
  }
}


