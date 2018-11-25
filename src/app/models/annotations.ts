import {   PolylineOptions,  Circle, Polyline, Rectangle, Marker,  polyline,   LatLngExpression,  Polygon, ImageOverlay, LatLngBounds, imageOverlay, ImageOverlayOptions, LatLng, marker, latLngBounds, latLng, Layer, Map as LeafletMap, ElemOverlay, DomUtil, ElemOverlayOptions } from "leaflet";
import { IconZoomLevelCache } from "./icon-cache";
import {  Asset } from "./core";
import { LangUtil } from "../util/LangUtil";
import { Aura, AuraVisible } from "./aura";
import { Character } from "./character";
import { LightSource, Vision } from "./light-vision";

export enum AnchorPostitionChoice {
  TopLeft = 0,
  TopCenter,
  TopRight,
  MiddleLeft,
  MiddleCenter,
  MiddleRight,
  BottomLeft,
  BottomCenter,
  BottomRight,
  Custom
}

export enum SizeUnit {
  Map = 0,
  Grid
}

/**
 * Annotations are things that go on the map. These can be shapes, markers, images, etc. 
 */
export abstract class Annotation extends Asset {
  public static readonly TYPE = 'db.Annotation'
  public static readonly FOLDER = 'annotations'

  static is(obj: any): obj is Annotation {
    return obj.objType !== undefined && obj.objType === Annotation.TYPE
  }

  static to(obj: any): Annotation {
    let rtn: Annotation
    if (MarkerTypeAnnotation.is(obj)) {
      rtn = new MarkerTypeAnnotation().copyFrom(obj)
    }
    if (ShapeAnnotation.is(obj)) {
      rtn = new ShapeAnnotation(obj.type).copyFrom(obj)
    }
    if (ImageAnnotation.is(obj)) {
      rtn = new ImageAnnotation().copyFrom(obj)
    }
    if (TokenAnnotation.is(obj)) {
      rtn = new TokenAnnotation().copyFrom(obj)
    }
    if (BarrierAnnotation.is(obj)) {
      rtn = new BarrierAnnotation().copyFrom(obj)
    }

    if (rtn) {
      if (rtn.points) {
        rtn.points = LangUtil.map2Array(rtn.points)
      }
      return rtn
    }

    throw new Error("Unable to convert to a type of annotation: Invalid Object")
  }

  dbPath(): string {
    return Annotation.FOLDER + '/' + this.map + "/" + this.id
  }

  readonly objType: string = Annotation.TYPE

  id: string
  name: string
  description?: string
  map: string
  group: string
  edit: string[]
  view: string[]
  mapLink: string
  pageUrl: string
  points: any[]
  tags: string[]
  snap: boolean

  // Do not save to database
  _leafletAttachment: any

  public setAttachment(item: any) {
    this._leafletAttachment = item
    this._leafletAttachment['title'] = this.name
  }

  public getAttachment(): any {
    return this._leafletAttachment
  }

  static fromLeaflet(layer: any): Annotation {
    return layer.objAttach
  }

  static findInLeaflet(map: LeafletMap, id: string): Annotation {
    let result = undefined
    map.eachLayer(layer => {
      let sfcId = layer['sfcId']
      if (sfcId && sfcId == id) {
        result = this.fromLeaflet(layer)
      }
    })
    return result
  }

  abstract copyPoints()
  abstract center(): LatLng

}

/**
 * Marker Type Annoations are instances of markers that use all the formating of 
 * a standard Marker Type. This is the preferred way of creating a markers.
 */
export class MarkerTypeAnnotation extends Annotation {
  public static readonly SUBTYPE = 'markerType'
  readonly subtype: string = MarkerTypeAnnotation.SUBTYPE
  _cache: IconZoomLevelCache

  static is(obj: any): obj is MarkerTypeAnnotation {
    return obj.objType !== undefined && obj.objType === Annotation.TYPE &&
      obj.subtype !== undefined && obj.subtype === MarkerTypeAnnotation.SUBTYPE
  }

  markerType: string

  get _iconUrl(): string {
    return this.toMarker().options.icon.options.iconUrl
  }

  set _iconUrl(url: string) {
    this.toMarker().options.icon.options.iconUrl = url

  }

  copyOptionsFromShape() {

  }

  copyOptionsToShape() {
    this.asItem().setIcon(this._cache.getAnyIcon(this.markerType))
    this.asItem().options.title = this.name

    let tt = this.asItem().getTooltip()
    if (tt) {
      tt.setContent(this.name)
    }
  }

  copyPoints() {
    if (!this._leafletAttachment) {
      return
    }

    let ll = this.toMarker().getLatLng()
    this.points = [ll]
  }

  toMarker(): Marker {
    return this._leafletAttachment
  }

  asItem(): Marker {
    return this._leafletAttachment
  }

  center(): LatLng {
    return this.toMarker().getLatLng()
  }

  setLocation(location: LatLngExpression) {
    this.points[0] = location
    this.toMarker().setLatLng(location)
  }
}

/**
 * Image Annotations are used to construct
 */
export class ImageAnnotation extends Annotation {
  public static readonly SUBTYPE = 'image'
  readonly subtype: string = ImageAnnotation.SUBTYPE
  static is(obj: any): obj is ImageAnnotation {
    return obj.objType !== undefined && obj.objType === Annotation.TYPE &&
      obj.subtype !== undefined && obj.subtype === ImageAnnotation.SUBTYPE
  }

  opacity: number = 1
  url?: string
  displayRange: [number, number] = [-20, 200]
  aspect: number // width / height
  keepAspect: boolean = false
  _saveImage = false
  _blob: Blob

  copyOptionsFromShape() {

  }

  copyOptionsToShape() {
    if (this._leafletAttachment) {
      this.asItem().setUrl(this.url)
      this.asItem().setOpacity(this.opacity)
    }
  }

  copyPoints() {
    if (!this._leafletAttachment) {
      return
    }

    this.points = [
      this._leafletAttachment.getBounds().getSouthWest(),
      this._leafletAttachment.getBounds().getNorthEast()
    ]
  }

  setBounds(bounds: LatLngBounds) {
    this.points = [
      bounds.getSouthWest(),
      bounds.getNorthEast()
    ]
  }

  asItem(): ImageOverlay {
    return this._leafletAttachment
  }

  center(): LatLng {
    return (<ImageOverlay>this._leafletAttachment).getBounds().getCenter()
  }
}

/**
 * Image Annotations are used to construct
 */
export class TokenAnnotation extends Annotation {
  public static readonly SUBTYPE = 'token'
  readonly subtype: string = TokenAnnotation.SUBTYPE

  static is(obj: any): obj is TokenAnnotation {
    return obj.objType !== undefined && obj.objType === Annotation.TYPE &&
      obj.subtype !== undefined && obj.subtype === TokenAnnotation.SUBTYPE
  }

  opacity: number = 1
  url?: string
  displayRange: [number, number] = [-20, 200]
  aspect: number // width / height
  keepAspect: boolean = false
  itemId: string
  itemType: string
  instanceId: number
  sizeX: number = 1.524;
  sizeY: number = 1.524;
  size : string
  snap = true;
  dead = false
  bars : TokenBar[] = []
  flyHeight = 0
  badge: string
  _saveImage = false
  _blob: Blob
  _selected: boolean

  calcCharacter: Character
  auras: Aura[] = []
  lights: LightSource[] = []
  vision: Vision = undefined

  showName : AuraVisible = AuraVisible.NotVisible
  showReach: AuraVisible = AuraVisible.NotVisible
  showSpeed: AuraVisible = AuraVisible.NotVisible
  showFly: AuraVisible = AuraVisible.Visible

  reach : number
  speed: number
  
  copyOptionsFromShape() {

  }

  copyOptionsToShape() {
    if (this._leafletAttachment) {
      // this.asItem().setUrl(this.url)
      // this.asItem().setOpacity(this.opacity)
    }
  }

  copyPoints() {
    if (!this._leafletAttachment) {
      return
    }

    this.points = [
      this._leafletAttachment.getBounds().getSouthWest(),
      this._leafletAttachment.getBounds().getNorthEast()
    ]
  }

  setBounds(bounds: LatLngBounds) {
    this.points = [
      bounds.getSouthWest(),
      bounds.getNorthEast()
    ]
  }

  asItem(): ElemOverlay {
    return this._leafletAttachment
  }


  center(): LatLng {
    return (<ElemOverlay>this._leafletAttachment).getBounds().getCenter()
  }

  setDead(dead: boolean) {
    const elem: ElemOverlay = this.asItem()
    const ref: HTMLElement = elem.getElement()
    
    console.log('Setting Dead', dead)

    if (dead) {
      DomUtil.addClass(ref, 'imgx')
    } else {
      DomUtil.removeClass(ref, 'imgx')
    }
  }
}

export class MarkerSizing {
  iconSize: [number, number]
  iconAnchor: [number, number]    // point of the icon which will correspond to marker's location
  url?: string
  zoomLevelForOriginalSize: number = 1
  zoomRange: [number, number] = [-20, 200]
  displayRange: [number, number] = [-20, 200]
  sizing: string = 'fixed'
  anchorPosition: AnchorPostitionChoice = AnchorPostitionChoice.MiddleCenter
}

export class ShapeAnnotation extends Annotation {
  public static readonly SUBTYPE = 'shape'
  readonly subtype: string = ShapeAnnotation.SUBTYPE

  static is(obj: any): obj is ShapeAnnotation {
    return obj.objType !== undefined && obj.objType === Annotation.TYPE &&
      obj.subtype !== undefined && obj.subtype === ShapeAnnotation.SUBTYPE
  }

  type: string
  border: boolean
  color: string
  weight: number
  style: string
  fill: boolean
  fillColor: string

  constructor(type: string) {
    super()
    this.type = type
  }

  copyOptionsFromShape() {
    this.border = this._leafletAttachment.options.stroke
    this.color = this._leafletAttachment.options.color
    this.weight = this._leafletAttachment.options.weight
    this.fill = this._leafletAttachment.options.fill
    this.fillColor = this._leafletAttachment.options.fillColor
    this.style = this._leafletAttachment.options.dashArray
  }

  copyOptionsToShape() {
    (<Polygon>this._leafletAttachment).setStyle(this.options())
    this._leafletAttachment.redraw()
  }

  copyPoints() {
    if (!this._leafletAttachment) {
      return
    }

    if (this.type == 'polygon') {
      let item: Polygon = <Polygon>this._leafletAttachment
      this.points = item.getLatLngs()
    } else if (this.type == 'polyline') {
      let item: Polyline = <Polyline>this._leafletAttachment
      this.points = item.getLatLngs()
    } else if (this.type == 'rectangle') {
      let item: Rectangle = <Rectangle>this._leafletAttachment
      let sw = item.getBounds().getSouthWest()
      let ne = item.getBounds().getNorthEast()
      this.points = [sw, ne]
    } else if (this.type === 'circle') {
      let item: Circle = <Circle>this._leafletAttachment
      this.points = [item.getLatLng(), item.getRadius()]
    }
  }


  options(): PolylineOptions {
    let opts: PolylineOptions = {}
    opts.fill = this.fill
    opts.stroke = this.border
    opts.weight = this.weight
    opts.noClip = true
    opts.dashArray = this.style
    if (this.color) {
      opts.color = LangUtil.baseColor(this.color)
      opts.opacity = LangUtil.colorAlpha(this.color)
    }

    if (this.fillColor) {
      opts.fillColor = LangUtil.baseColor(this.fillColor)
      opts.fillOpacity = LangUtil.colorAlpha(this.fillColor)
    }
    return opts
  }

  asItem(): Polygon | Polyline | Circle | Rectangle {
    if (this.type == 'polygon') {
      return <Polygon>this._leafletAttachment
    } else if (this.type == 'polyline') {
      return <Polyline>this._leafletAttachment
    } else if (this.type == 'rectangle') {
      return <Rectangle>this._leafletAttachment
    } else if (this.type === 'circle') {
      return <Circle>this._leafletAttachment
    }
  }

  center(): LatLng {
    if (!this._leafletAttachment || !this._leafletAttachment._map) {
      return latLng(0, 0)
    }

    if (this.type == 'polygon') {
      return (<Polygon>this._leafletAttachment).getCenter()
    } else if (this.type == 'polyline') {
      return (<Polyline>this._leafletAttachment).getCenter()
    } else if (this.type == 'rectangle') {
      return (<Rectangle>this._leafletAttachment).getCenter()
    } else if (this.type === 'circle') {
      return (<Circle>this._leafletAttachment).getLatLng()
    }
  }

}

export class BarrierAnnotation extends Annotation {
  public static readonly SUBTYPE = 'barrier'
  readonly subtype: string = BarrierAnnotation.SUBTYPE

  static is(obj: any): obj is BarrierAnnotation {
    return obj.objType !== undefined && obj.objType === Annotation.TYPE &&
      obj.subtype !== undefined && obj.subtype === BarrierAnnotation.SUBTYPE
  }

  enabled: boolean = true
  border: boolean
  color: string
  weight: number
  style: string
  blocksLight: boolean = true
  transmission: number = 0
  emissionsBlocked: string[] = []

  constructor() {
    super()
  }

  copyOptionsFromShape() {
    this.border = this._leafletAttachment.options.stroke
    this.color = this._leafletAttachment.options.color
    this.weight = this._leafletAttachment.options.weight
  }

  copyOptionsToShape() {
    (<Polyline>this._leafletAttachment).setStyle(this.options())
    this._leafletAttachment.redraw()
  }

  copyPoints() {
    if (!this._leafletAttachment) {
      return
    }

    let item: Polyline = <Polyline>this._leafletAttachment
    this.points = item.getLatLngs()
  }

  toShape(): Polyline {
    return polyline(this.points, this.options())
  }

  options(): PolylineOptions {
    let opts: PolylineOptions = {}
    opts.stroke = this.border
    opts.weight = this.weight
    opts.noClip = true
    opts.dashArray = this.style
    if (this.color) {
      opts.color = LangUtil.baseColor(this.color)
      opts.opacity = LangUtil.colorAlpha(this.color)
    }

    return opts
  }

  createLeafletAttachment(iconCache: IconZoomLevelCache): any {
    return this.toShape()
  }

  asItem(): Polyline {
    return <Polyline>this._leafletAttachment
  }

  center(): LatLng {
    if (!this._leafletAttachment || !this._leafletAttachment._map) {
      return latLng(0, 0)
    }
    return (<Polyline>this._leafletAttachment).getCenter()
  }

}


class DeadImages {
  static Images = {}
}

export class TokenBar {
  name: string = "New Bar"
  source: string
  warnRange: number = 0.25
  bgColor: string = '#444444'
  color: string = 'blue'
  warnColor: string = 'red'
  visible :AuraVisible = AuraVisible.NotVisible
  value: number = 100
  max: number = 100
}
