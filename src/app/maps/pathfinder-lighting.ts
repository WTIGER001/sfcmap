import { Distance } from "../models";
import { AuraVisibleTo, AuraVisible } from "../models/aura";
import { Point, ImageOverlay, latLngBounds } from "leaflet";
import * as _ from 'lodash'
import { MapService } from "./map.service";
import { ImageUtil } from "../util/ImageUtil";
import { Rect } from "../util/geom";

/*
Maybe use a webGL shader
1.) Crate a new canvas and fill with the ambient conditions
2.) Loop through the nonmagical lights sources and draw each one (5 colors of grey for light) (maybe 5 colors of black with differnt opacities)


*/

/*
  Gridded Approach

  1.) Create a matrix of cells [x][y][level]
  2.) Fill in the level 1 of the matrix with ambient light [][][0]
  3.) Loop through each normal source and apply it  [][][1]
  4.) Loop through each magical source and apply it [][][2]
  5.) Draw each cell on the image (withj transparency), Anything dark has no transparency anything bright or normal has 1 or .9 transparency, Dim is .6 transparency. If the character has darkvision then the areas of darkness are .55
  /// THIS IS THE BASE LIGHTING
*/
export enum LightLevel {
  Bright = 5,
  Normal = 4,
  Dim = 3,
  Dark = 2,
  MagicalDark = 1
}

export enum RangeEffect {
  Plus1UpToNormal = 0,
  Minus1,
  SetNormal,
}

export class LightSource {
  id: string
  name : string
  enabled: boolean
  lightType: number // 0 - light, 1 darkness
  magicalLevel : number = -1 // normal (non magical), 0-9 are magical levels
  range : number
  rangeEffect: RangeEffect
  dimRange: number
  dimRangeEffect: RangeEffect
  angleStart = 0
  angleEnd = 360
  color = '#000000FF'
  location : Point
}

export class Vision {
  normal : boolean
  dark : boolean
  lowLight : boolean
  lowLightRange : number
  darkRange : number
  shared: boolean
}

export class Barrier {
  location: Point[]
}

export class MapLighting {
  ambientLight = LightLevel.Dark
  clrDark : string = "#000000"
  clrDim : string = "#000000"
  clrNormal : string = "#000000"
  clrBright : string = "#000000"
  clrMagicDark : string = "#000000"

  barriers : Barrier[] = []
  lights: LightSource[] = []
}







/**
 * Manages the lighting on the map
 */
export class LightingManager {
  overlay : ImageOverlay
  settings: MapLighting

  constructor(private mapSvc : MapService) {

  }

  public update() {
    // Get the context
    let factor = this.mapSvc._mapCfg.ppm
    const llBounds = latLngBounds([[0, 0], [this.mapSvc._mapCfg.height / factor, this.mapSvc._mapCfg.width / factor]]);

    const bounds = new Rect(0, 0, this.mapSvc._mapCfg.width, this.mapSvc._mapCfg.height)

    const canvas = ImageUtil.offscreen()
    canvas.width = bounds.width
    canvas.height = bounds.height

    const ctx = canvas.getContext('2d')
    ctx.save()

    // Flip the image vertically to match the leaflet approach
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
  
    // Draw the Ambient Light color
    this.drawAmbient(ctx, canvas)

    // Calculate the Mask as polygons
    




    // Draw the mask path and clip


    // Draw each light source


    // Draw each characters vision


    // Create / Update the Image Overlay


  }

  private drawAmbient(ctx : CanvasRenderingContext2D, canvas : HTMLCanvasElement) {
    ctx.fillStyle = this.getColor(this.settings.ambientLight)
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  private getColor(level : LightLevel) : string {
    if (level == LightLevel.Bright) {
      return this.settings.clrBright
    }
    if (level == LightLevel.Dark) {
      return this.settings.clrDark
    }
    if (level == LightLevel.Dim) {
      return this.settings.clrDim
    }
    if (level == LightLevel.MagicalDark) {
      return this.settings.clrMagicDark
    }
    if (level == LightLevel.Normal) {
      return this.settings.clrNormal
    }
    return '#FF69B4' // HOT PINK... This should indicate an error :)
  }


}

export class VisionManager {

  public static calcLight(ambient: LightLevel, w: number, h: number, gridSize: number, sources: LightSource[]): number[][][] {
    const data = this.makeAmbient(ambient, w, h, gridSize)
    this.calcNormal(sources, gridSize, data)
    this.calcMagical(sources, data)
    return data
  }

  public static makeAmbient(ambient : LightLevel, w : number, h: number, gridSize : number) : number[][][] {
    const rows = Math.ceil(w/ gridSize)
    const cols = Math.ceil(h / gridSize)

    const data : number[][][]= [rows][cols][3]
    for (let x = 0; x<rows; x++) {
      for (let y=0; y < cols; y++) {
        data[x][y][0] = ambient
        data[x][y][1] = 0
        data[x][y][2] = 0
      }
    }


    
    return data
  }

  public static calcNormal(sources: LightSource[], gridSize: number, data : number[][][]) {
    const normal = sources.filter(s => s.magicalLevel === -1)
    normal.forEach( src => {
      for (let x = 0; x < data.length; x++) {
        for (let y = 0; y < data[0].length; y++) {
          this.calcNormalSourceXY(src, x, y, gridSize, data)
        }
      }
    })
  }

  private static calcNormalSourceXY(source: LightSource, x: number, y: number, gridSize: number, data : number[][][]) {
    // Check if this x  and y contain a light
    const dist = source.location.distanceTo([x,y])
    if (dist <= source.range) {
      data[x][y][1] = this.calcLightValue(data[x][y][0], source.rangeEffect)
    } else  if ( dist <= source.dimRange) {
      data[x][y][1] = this.calcLightValue(data[x][y][0], source.dimRangeEffect)
    } else {
      data[x][y][1] = data[x][y][0]
    }
  }

  public static calcLightValue(current: number, effect : RangeEffect) : number {
    if (effect === RangeEffect.Plus1UpToNormal) {
      return Math.min(LightLevel.Normal, current + 1)
    }
    if (effect === RangeEffect.Minus1) {
      return Math.max(LightLevel.Dark, current - 1)
    }
    if (effect === RangeEffect.SetNormal) {
      return LightLevel.Normal
    }
  }

  public static calcMagical(sources: LightSource[], data: number[][][]) {
    const magical = sources.filter(s => s.magicalLevel >= 0)
    magical.forEach(src => {




    })

  }

}