import { Asset } from "../models";
import { Rectangle, Polygon, PolylineOptions, polygon, rectangle, LatLng, latLng, LayerGroup, Layer, LayerOptions, Map as LeafletMap, imageOverlay, ImageOverlay, latLngBounds, Circle } from "leaflet";
import { LangUtil } from "../util/LangUtil";
import { ImageUtil } from "../util/ImageUtil";
import { DataService } from "../data.service";
import { Rect } from "../util/geom";
import { MapService } from "./map.service";
import { Trans } from "../util/transformation";
import { copyStyles } from "@angular/animations/browser/src/util";



/**
  Fog Of War data model. This holds all the configuration information that is stored and used
 */
export class FogOfWar extends Asset {
  public static readonly TYPE = 'fow'
  public static readonly FOLDER = 'fow'
  readonly objType: string = FogOfWar.TYPE

  static is(obj: any): obj is FogOfWar {
    console.log("Checking IS", obj, obj.objType === FogOfWar.TYPE, obj.objType == FogOfWar.TYPE)
    return obj.objType !== undefined && obj.objType === FogOfWar.TYPE
  }

  static to(obj: any): FogOfWar {
    console.log("Copying Obj", obj)
    return new FogOfWar().copyFrom(obj)
  }

  enabled = false
  map: string;
  color: string = '#000'
  gmcolor: string = '#242424e0'
  blur: number = 7
  reveals: FowShape[] = []
  hideAll = true;
}

/**
  Fog of War shape data model.
 */
export class FowShape {
  type: string
  hide = false
  points: any[]
  constructor(shape: Polygon | Rectangle | Circle) {
    if (!shape) {
      return
    }

    if (shape instanceof Polygon) {
      this.type = 'polygon'

      const temp: LatLng[] = <LatLng[]>shape.getLatLngs()[0]
      this.points = temp.map(p => latLng(p.lat, p.lng))
    }

    if (shape instanceof Rectangle) {
      this.type = 'rectangle'

      let sw = shape.getBounds().getSouthWest()
      let ne = shape.getBounds().getNorthEast()
      this.points = [sw, ne]
    }

    if (shape instanceof Circle) {
      this.type = 'circle'
      this.points = [latLng(shape.getLatLng().lat, shape.getLatLng().lng), shape.getRadius()]
      console.log("Saving Circle", this.points)
    }
  }
}

/**
  Fog of War Manager. This class performs the interaction with the map.
 */
export class FowManager {

  private imgOverlay: ImageOverlay
  private fow: FogOfWar

  constructor(private mapSvc: MapService, private data: DataService) {
    
  }


  setFow(fow: FogOfWar) {
    this.fow = fow
    console.log("Setting FOW IN LAYER", fow)
    if (fow.enabled) {
      console.log("Creating FOW ")
      this.createOverlay(this.mapSvc._map)
    } else if (this.imgOverlay) {
      console.log("Removing FOW LAYER")

      this.imgOverlay.remove()
    }
  }

  createOverlay(map: LeafletMap) {
    let factor = Trans.computeFactor(this.mapSvc._mapCfg)
    let transformation = Trans.createTransform(this.mapSvc._mapCfg)
    const llBounds = latLngBounds([[0, 0], [this.mapSvc._mapCfg.height / factor, this.mapSvc._mapCfg.width / factor]]);

    const color = this.data.isGM() ? this.fow.gmcolor : this.fow.color
    const bounds = new Rect(0, 0, this.mapSvc._mapCfg.width, this.mapSvc._mapCfg.height)

    const canvas = ImageUtil.offscreen()
    canvas.width = bounds.width
    canvas.height = bounds.height

    const ctx = canvas.getContext('2d')
    ctx.save()

    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);

    // Create the base rectangle
    ctx.fillStyle = color
    if (this.fow.hideAll) {
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    ctx['filter'] = `blur(${this.fow.blur}px)`
    this.drawShapes(ctx, color, factor)

    const data = canvas.toDataURL()
    if (this.imgOverlay) {
      this.imgOverlay.setUrl(data)
    } else {
      this.imgOverlay = imageOverlay(data, llBounds, { pane: 'fow', interactive: !this.data.isGM() })
    }

    this.imgOverlay.addTo(map)
    ctx.restore()
  }

  drawShapes(ctx: CanvasRenderingContext2D, color: string, factor : number) {
    this.fow.reveals.forEach(r => {
      console.log("Processing Reveal / Hide ", r)
      if (r.hide) {
        ctx.globalCompositeOperation = 'source-over'
        ctx.fillStyle = color
      } else {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.fillStyle = '#fff'
      }

      if (r.type == 'polygon') {
        ctx.beginPath()

        // A polygons points are really in the second array
        const pts: LatLng[] = r.points

        // Move to the first point
        ctx.moveTo(pts[0].lng * factor, pts[0].lat * factor)
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].lng * factor, pts[i].lat * factor)
        }

        ctx.fill()
      } else if (r.type == 'rectangle') {
        ctx.fillRect(
          r.points[0].lng * factor,
          r.points[0].lat * factor,
          (r.points[1].lng - r.points[0].lng) * factor,
          (r.points[1].lat - r.points[0].lat) * factor)
      } else if (r.type == 'circle') {
        ctx.beginPath()
        ctx.arc(
          r.points[0].lng * factor,
          r.points[0].lat * factor,
          r.points[1] * factor,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }
    })
  }
}