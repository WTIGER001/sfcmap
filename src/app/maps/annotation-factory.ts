import { Annotation, MarkerTypeAnnotation, ImageAnnotation, TokenAnnotation, ShapeAnnotation, BarrierAnnotation, IconZoomLevelCache, MarkerType, AnchorPostitionChoice, Barrier, MapConfig, GameSystem, TokenSize } from "../models";
import { icon, marker, Marker, LatLngBounds, imageOverlay, elemOverlay, DomUtil, ElemOverlay, ImageOverlay, Polygon, Polyline, Circle, Rectangle, polygon, polyline, rectangle, CircleMarkerOptions, LatLngExpression, circle, PolylineOptions, ElemOverlayOptions, ImageOverlayOptions, MarkerOptions } from "leaflet";
import { ComponentFactoryResolver, ViewContainerRef } from "@angular/core";
import { TokenIconComponent } from "./controls/token-icon/token-icon.component";
import { LangUtil } from "../util/LangUtil";
import { Assets } from "../assets";
import { DistanceUnit } from "../util/transformation";
import { MapService } from "./map.service";

export class AnnotationFactory {
  iconCache: IconZoomLevelCache
  resolver: ComponentFactoryResolver
  viewref: ViewContainerRef
  markerTypes: MarkerType[]

  constructor(iconCache: IconZoomLevelCache, resolver: ComponentFactoryResolver, viewref: ViewContainerRef, markerTypes: MarkerType[]) {
    this.iconCache = iconCache
    this.resolver = resolver
    this.viewref = viewref
    this.markerTypes = markerTypes
  }

  toLeaflet(annotation: Annotation, mapCfg : MapConfig, gs : GameSystem, mapSvc : MapService): any {
    if (MarkerTypeAnnotation.is(annotation)) {
      return AnnotationFactory.createMarker(annotation, this.iconCache, this.markerTypes)
    }
    if (ShapeAnnotation.is(annotation)) {
      return AnnotationFactory.createShape(annotation)
    }
    if (ImageAnnotation.is(annotation)) {
      return AnnotationFactory.createImage(annotation)
    }
    if (TokenAnnotation.is(annotation)) {
      return this.createToken(annotation, gs, mapSvc)
    }
    if (BarrierAnnotation.is(annotation)) {
      return AnnotationFactory.createBarrier(annotation)
    }
    console.log("No Match", annotation)

    throw new Error("Invalid Annotation " + annotation.objType)
  }

  private static attachObj(item: Annotation, leafletObj: Marker | ElemOverlay | ImageOverlay | Polygon | Polyline | Circle | Rectangle ) {
    leafletObj['objAttach'] = item
    item._leafletAttachment = leafletObj
  }

  public static createMarker(item: MarkerTypeAnnotation, cache : IconZoomLevelCache, types: MarkerType[]): Marker {
    const opts = this.markerTypeOptions(item, cache, types)
    const m = marker(item.points[0], opts)
    m['iconUrl'] = () => {
      return m.options.icon.options.iconUrl
    }
    AnnotationFactory.attachObj(item, m)
    return m
  }

  public static createImage(item: ImageAnnotation): ImageOverlay {
    let bounds = new LatLngBounds(item.points[0], item.points[1])
    let options = this.imageOptions(item)
    let img = imageOverlay(item.url, bounds, options)
    img.setBounds(bounds)
    this.attachObj(item, img)

    return img
  }

  createToken(item: TokenAnnotation, gs: GameSystem, mapSvc : MapService): ElemOverlay {
    let bounds = new LatLngBounds(item.points[0], item.points[1])
    let options = AnnotationFactory.tokenOptions(item)

    // Create the div
    const factory = this.resolver.resolveComponentFactory(TokenIconComponent)
    const component = factory.create(this.viewref.injector)

    // Set the inputs
    component.instance.item = item

    // add to the view
    const inserted = this.viewref.insert(component.hostView)

    options.existing = component.instance.elRef.nativeElement
    const elem = elemOverlay('div', bounds, options)
    elem['_component'] = component

    component.instance.hover.subscribe(hovering => {
      mapSvc.hovering.next({ item: item, hover: hovering })
    })

    // Calculate the bounds based on the size
    const tokenSize = gs.sizes.find( s => s.key === item.size) || new TokenSize("unk", 'unk', 5, 5, DistanceUnit.Feet)
    const w = tokenSize.unit.toMeters(tokenSize.width) 
    const h = tokenSize.unit.toMeters(tokenSize.height) 
    const lat = item.points[0].lat + h
    const lng = item.points[0].lng + w
    bounds = new LatLngBounds(item.points[0], [lat, lng] )

    elem.setBounds(bounds)

    if (item.dead) {
      DomUtil.addClass(component.instance.elRef.nativeElement, 'imgx')
    } else {
      DomUtil.removeClass(component.instance.elRef.nativeElement, 'imgx')
    }

    AnnotationFactory.attachObj(item, elem)
    return elem
  }

  public static createShape(item: ShapeAnnotation): Polygon | Polyline | Circle | Rectangle {
    let obj: any
    if (item.type == 'polygon') {
      obj =  this.toPolygon(item)
    } else if (item.type == 'polyline') {
      obj =  this.toPolyline(item)
    } else if (item.type == 'rectangle') {
      obj =  this.toRectangle(item)
    } else if (item.type === 'circle') {
      obj =  this.toCircle(item)
    }
    if (obj) {
      this.attachObj(item, obj)
      return obj
    }
    
    throw new Error("Type not supported -> " + item.type);
  }

  private static toPolygon(item: ShapeAnnotation): Polygon {
    return polygon(item.points, this.shapeOptions(item))
  }

  private static  toPolyline(item: ShapeAnnotation): Polyline {
    return polyline(item.points, this.shapeOptions(item))
  }

  private static toRectangle(item: ShapeAnnotation): Rectangle {
    if (item.points && item.points.length > 1) {
      return rectangle(item.points, this.shapeOptions(item))
    } else {
      return rectangle([[0, 0], [1, 1]], this.shapeOptions(item))
    }
  }

  private static toCircle(item: ShapeAnnotation): Circle {
    let options: CircleMarkerOptions = {
      fill: item.fill,
      fillColor: item.fillColor,
      stroke: item.border,
      color: item.color,
      weight: item.weight,
      radius: item.points[1],
      dashArray :item.style
    }
    let center: LatLngExpression = item.points[0]
    return circle(center, options)
  }

  public static createBarrier(item: BarrierAnnotation): Polyline {
    const obj =  polyline(item.points, this.barrierOptions(item))
      this.attachObj(item, obj)
      return obj
  }

  public static shapeOptions(item: ShapeAnnotation): PolylineOptions {
    let opts: PolylineOptions = {}
    opts.fill = item.fill
    opts.stroke = item.border
    opts.weight = item.weight
    opts.dashArray = item.style
    opts.noClip = true
    if (item.color) {
      opts.color = LangUtil.baseColor(item.color)
      opts.opacity = LangUtil.colorAlpha(item.color)
    }

    if (item.fillColor) {
      opts.fillColor = LangUtil.baseColor(item.fillColor)
      opts.fillOpacity = LangUtil.colorAlpha(item.fillColor)
    }
    return opts
  }

  public static barrierOptions(item: BarrierAnnotation): PolylineOptions {
    let opts: PolylineOptions = {}
    opts.stroke = item.border
    opts.weight = item.weight

    opts.noClip = true
    if (item.color) {
      opts.color = LangUtil.baseColor(item.color)
      opts.opacity = LangUtil.colorAlpha(item.color)
    }
    return opts
  }

  public static tokenOptions(item: TokenAnnotation): ElemOverlayOptions {
    return {
      opacity: item.opacity,
      interactive: true,
      errorOverlayUrl: "./assets/missing.png",
    }
  }

  public static imageOptions(item: ImageAnnotation): ImageOverlayOptions {
    return {
      opacity: item.opacity,
      interactive: true,
      errorOverlayUrl: "./assets/missing.png",
    }
  }

  static markerTypeOptions(item: MarkerTypeAnnotation, cache: IconZoomLevelCache, markerTypes  : MarkerType[]): MarkerOptions {
    // Try the icon cache first. This is being phased out (hopefully)
    const myCache = cache 
    if (myCache) {
      console.log("Loading Icon from cache", item.markerType)
      let icn = myCache.getAnyIcon(item.markerType)
      if (icn) {
        return {
          icon: icn
        }
      }
    }

    // Try to build the marker from the marker types
    if (markerTypes) {
      console.log("Loading Icon from markerTypes", item.markerType)

      const type = markerTypes.find(t => t.id == item.markerType)
      if (type) {
        let icn = this.generateIcon(type)
        return {
          icon: icn
        }
      }
    }

    console.log("Nothing Found for", item.markerType)

    // Default to the missing picture icon
    return {
      icon: icon({
        iconUrl: Assets.MissingMarker,
        iconSize: [30, 46],
        iconAnchor: [15, 46]
      })
    }
  }

  static generateIcon(type: MarkerType) {

    let anchor = this.calcAnchor(type.iconSize, type)
    let icn = icon({
      iconUrl: type.url,
      iconSize: type.iconSize,
      iconAnchor: anchor
    })
    return icn
  }

  static calcAnchor(size: [number, number], type: MarkerType): [number, number] {

    let [sx, sy] = [1, 1]
    if (type.anchorPosition == AnchorPostitionChoice.BottomLeft) {
      sx = 0
      sy = size[1]
    } else if (type.anchorPosition == AnchorPostitionChoice.BottomCenter) {
      sx = 0.5 * size[0]
      sy = size[1]
    } else if (type.anchorPosition == AnchorPostitionChoice.BottomRight) {
      sx = size[0]
      sy = size[1]
    } else if (type.anchorPosition == AnchorPostitionChoice.MiddleLeft) {
      sx = 0
      sy = 0.5 * size[1]
    } else if (type.anchorPosition == AnchorPostitionChoice.MiddleCenter) {
      sx = 0.5 * size[0]
      sy = 0.5 * size[1]
    } else if (type.anchorPosition == AnchorPostitionChoice.MiddleRight) {
      sx = size[0]
      sy = 0.5 * size[1]
    } else if (type.anchorPosition == AnchorPostitionChoice.TopLeft) {
      sx = 0
      sy = 0
    } else if (type.anchorPosition == AnchorPostitionChoice.TopCenter) {
      sx = 0.5 * size[0]
      sy = 0
    } else if (type.anchorPosition == AnchorPostitionChoice.TopRight) {
      sx = size[0]
      sy = 0
    }

    return [sx, sy]
  }
}