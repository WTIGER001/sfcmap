import { Distance, BarrierAnnotation, TokenAnnotation, MapLighting, LightSource, LightLevel } from "../models";
import { AuraVisibleTo, AuraVisible } from "../models/aura";
import { Point, ImageOverlay, latLngBounds, LatLng } from "leaflet";
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


/**
 * Manages the lighting on the map
 */
export class LightingManager {
  overlay : ImageOverlay
  settings: MapLighting

  barriers : BarrierAnnotation[] = []
  lights: LightSource[]= []
  barrierSegments = []

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
    this.readModels()
    this.buildSegments()

    // Draw the mask path and clip


    // Draw each light source


    // Draw each characters vision


    // Create / Update the Image Overlay

  }


  private readModels() {
    const lights : LightSource[] = []
    const barriers : BarrierAnnotation[] = []
    const viewers : TokenAnnotation[] = []

    const all = this.mapSvc.annotationsFromMap()
    all.forEach( a => {
      if (TokenAnnotation.is(a)) {
        if (a.vision && a.vision.enabled) {
          viewers.push(a)
        }
        lights.push(... a.lights)
      } else if (BarrierAnnotation.is(a)) {
        barriers.push(a)
      }
    })
  }

  private buildSegments() {
    const segments = []
    // Build the segments for the map border
    const w= this.mapSvc._mapCfg.width
    const h= this.mapSvc._mapCfg.height

    segments.push({ a: { x: 0, y: 0 }, b: { x: w, y: 0 } })
    segments.push({ a: { x: w, y: 0 }, b: { x: w, y: h } })
    segments.push({ a: { x: w, y: h }, b: { x: w, y: h } })
    segments.push({ a: { x: 0, y: h }, b: { x: 0, y: 0 } })

    // add in each barrier
    this.barriers.forEach( b => {
      const pts : LatLng[] =  b.points
      for (let i =0; i<pts.length-1; i++) {
        segments.push({ a: { x: pts[i].lng, y: pts[i].lat }, b: { x: pts[i+1].lng, y: pts[i+1].lat} })
      }
    })
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

  private calculateTotalMask() {

  }


  // Basd on where this token is create amask
  private calculateMaskForViewer(viewer : TokenAnnotation) : Intersection[]{

    const ll = viewer.center()
    const viewerLocation = new Point(ll.lng, ll.lat)
    const rtn = VisionUtil.calculateIntersects(viewerLocation, this.barrierSegments)

    return rtn
  }


}


export class VisionUtil {

  // Find intersection of RAY & SEGMENT
  static getIntersection(ray, segment) : any {

    // RAY in parametric: Point + Delta*T1
    var r_px = ray.a.x;
    var r_py = ray.a.y;
    var r_dx = ray.b.x - ray.a.x;
    var r_dy = ray.b.y - ray.a.y;

    // SEGMENT in parametric: Point + Delta*T2
    var s_px = segment.a.x;
    var s_py = segment.a.y;
    var s_dx = segment.b.x - segment.a.x;
    var s_dy = segment.b.y - segment.a.y;

    // Are they parallel? If so, no intersect
    var r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
    var s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
    if (r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag) {
      // Unit vectors are the same.
      return null;
    }

    // SOLVE FOR T1 & T2
    // r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
    // ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
    // ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
    // ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
    var T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
    var T1 = (s_px + s_dx * T2 - r_px) / r_dx;

    // Must be within parametic whatevers for RAY/SEGMENT
    if (T1 < 0) return null;
    if (T2 < 0 || T2 > 1) return null;

    // Return the POINT OF INTERSECTION
    return {
      x: r_px + r_dx * T1,
      y: r_py + r_dy * T1,
      param: T1
    };
  }

  static getUniquePoints(segments : any[]) : any[] {
    const pts : number[] = []
    segments.forEach( s => {
      pts.push(s.a, s.b)
    })
    return _.uniq(pts)
  }

  static getAngles(viewLocation: Point, uniquePoints : any[]) {
    const uniqueAngles : number[] = [];
    for (var j = 0; j < uniquePoints.length; j++) {
      var uniquePoint = uniquePoints[j];
      var angle = Math.atan2(uniquePoint.y - viewLocation.y, uniquePoint.x - viewLocation.x);
      uniquePoint.angle = angle;
      uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001);
    }
    return uniqueAngles
  }

  static determineIntersects(uniqueAngles: number[], segments : Segment[], viewLocation: Point) {
    var intersects = [];
    for (var j = 0; j < uniqueAngles.length; j++) {
      var angle = uniqueAngles[j];

      // Calculate dx & dy from angle
      var dx = Math.cos(angle);
      var dy = Math.sin(angle);

      // Ray from center of screen to viewLocation
      var ray = {
        a: { x: viewLocation.x, y: viewLocation.y },
        b: { x: viewLocation.x + dx, y: viewLocation.y + dy }
      };

      // Find CLOSEST intersection
      var closestIntersect = null;
      for (var i = 0; i < segments.length; i++) {
        var intersect = this.getIntersection(ray, segments[i]);
        if (!intersect) continue;
        if (!closestIntersect || intersect.param < closestIntersect.param) {
          closestIntersect = intersect;
        }
      }

      // Intersect angle
      if (!closestIntersect) continue;
      closestIntersect.angle = angle;

      // Add to list of intersects
      intersects.push(closestIntersect);
    }

    // Sort intersects by angle
    intersects = intersects.sort(function (a, b) {
      return a.angle - b.angle;
    });

    return intersects
  }

  public static calculateIntersects(viewLocation: Point, barriers: Segment[]): Intersection[] {
    const points = this.getUniquePoints(barriers)
    const angles = this.getAngles(viewLocation, points)
    const intersects = this.determineIntersects(angles, barriers, viewLocation)
    return intersects
  }
}

export interface Segment {
  a : AnglePoint
  b : AnglePoint
}

export interface AnglePoint {
  x : number,
  y: number,
  angle ?: number
}

export interface Intersection {
  x : number
  y: number
  param : number
}

// draw() {



//   // RAYS IN ALL DIRECTIONS
//   var intersects = [];
//   for (var j = 0; j < uniqueAngles.length; j++) {
//     var angle = uniqueAngles[j];

//     // Calculate dx & dy from angle
//     var dx = Math.cos(angle);
//     var dy = Math.sin(angle);

//     // Ray from center of screen to viewLocation
//     var ray = {
//       a: { x: viewLocation.x, y: viewLocation.y },
//       b: { x: viewLocation.x + dx, y: viewLocation.y + dy }
//     };

//     // Find CLOSEST intersection
//     var closestIntersect = null;
//     for (var i = 0; i < segments.length; i++) {
//       var intersect = this.getIntersection(ray, segments[i]);
//       if (!intersect) continue;
//       if (!closestIntersect || intersect.param < closestIntersect.param) {
//         closestIntersect = intersect;
//       }
//     }

//     // Intersect angle
//     if (!closestIntersect) continue;
//     closestIntersect.angle = angle;

//     // Add to list of intersects
//     intersects.push(closestIntersect);

//   }

//   // Sort intersects by angle
//   intersects = intersects.sort(function (a, b) {
//     return a.angle - b.angle;
//   });

//   // DRAW AS A GIANT POLYGON
//   ctx.fillStyle = "#dd3838";
//   ctx.beginPath();
//   ctx.moveTo(intersects[0].x, intersects[0].y);
//   for (var i = 1; i < intersects.length; i++) {
//     var intersect = intersects[i];
//     ctx.lineTo(intersect.x, intersect.y);
//   }
//   ctx.fill();

//   // DRAW DEBUG LINES
//   ctx.strokeStyle = "#f55";
//   for (var i = 0; i < intersects.length; i++) {
//     var intersect = intersects[i];
//     ctx.beginPath();
//     ctx.moveTo(viewLocation.x, viewLocation.y);
//     ctx.lineTo(intersect.x, intersect.y);
//     ctx.stroke();
//   }

// }

// }




// // LINE SEGMENTS
// var segments = [

//   // Border
//   { a: { x: 0, y: 0 }, b: { x: 640, y: 0 } },
//   { a: { x: 640, y: 0 }, b: { x: 640, y: 360 } },
//   { a: { x: 640, y: 360 }, b: { x: 0, y: 360 } },
//   { a: { x: 0, y: 360 }, b: { x: 0, y: 0 } },

//   // Polygon #1
//   { a: { x: 100, y: 150 }, b: { x: 120, y: 50 } },
//   { a: { x: 120, y: 50 }, b: { x: 200, y: 80 } },
//   { a: { x: 200, y: 80 }, b: { x: 140, y: 210 } },
//   { a: { x: 140, y: 210 }, b: { x: 100, y: 150 } },

//   // Polygon #2
//   { a: { x: 100, y: 200 }, b: { x: 120, y: 250 } },
//   { a: { x: 120, y: 250 }, b: { x: 60, y: 300 } },
//   { a: { x: 60, y: 300 }, b: { x: 100, y: 200 } },

//   // Polygon #3
//   { a: { x: 200, y: 260 }, b: { x: 220, y: 150 } },
//   { a: { x: 220, y: 150 }, b: { x: 300, y: 200 } },
//   { a: { x: 300, y: 200 }, b: { x: 350, y: 320 } },
//   { a: { x: 350, y: 320 }, b: { x: 200, y: 260 } },

//   // Polygon #4
//   { a: { x: 340, y: 60 }, b: { x: 360, y: 40 } },
//   { a: { x: 360, y: 40 }, b: { x: 370, y: 70 } },
//   { a: { x: 370, y: 70 }, b: { x: 340, y: 60 } },

//   // Polygon #5
//   { a: { x: 450, y: 190 }, b: { x: 560, y: 170 } },
//   { a: { x: 560, y: 170 }, b: { x: 540, y: 270 } },
//   { a: { x: 540, y: 270 }, b: { x: 430, y: 290 } },
//   { a: { x: 430, y: 290 }, b: { x: 450, y: 190 } },

//   // Polygon #6
//   { a: { x: 400, y: 95 }, b: { x: 580, y: 50 } },
//   { a: { x: 580, y: 50 }, b: { x: 480, y: 150 } },
//   { a: { x: 480, y: 150 }, b: { x: 400, y: 95 } }

// ];

// // DRAW LOOP
// window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
// var updateCanvas = true;
// function drawLoop() {
//   requestAnimationFrame(drawLoop);
//   if (updateCanvas) {
//     draw();
//     updateCanvas = false;
//   }
// }
// window.onload = function () {
//   drawLoop();
// };

// // viewLocation	
// var viewLocation = {
//   x: canvas.width / 2,
//   y: canvas.height / 2
// };
// canvas.onviewLocationmove = function (event) {
//   viewLocation.x = event.clientX;
//   viewLocation.y = event.clientY;
//   updateCanvas = true;
// };









// export class VisionManager {

//   public static calcLight(ambient: LightLevel, w: number, h: number, gridSize: number, sources: LightSource[]): number[][][] {
//     const data = this.makeAmbient(ambient, w, h, gridSize)
//     this.calcNormal(sources, gridSize, data)
//     this.calcMagical(sources, data)
//     return data
//   }

//   public static makeAmbient(ambient : LightLevel, w : number, h: number, gridSize : number) : number[][][] {
//     const rows = Math.ceil(w/ gridSize)
//     const cols = Math.ceil(h / gridSize)

//     const data : number[][][]= [rows][cols][3]
//     for (let x = 0; x<rows; x++) {
//       for (let y=0; y < cols; y++) {
//         data[x][y][0] = ambient
//         data[x][y][1] = 0
//         data[x][y][2] = 0
//       }
//     }


    
//     return data
//   }

//   public static calcNormal(sources: LightSource[], gridSize: number, data : number[][][]) {
//     const normal = sources.filter(s => s.magicalLevel === -1)
//     normal.forEach( src => {
//       for (let x = 0; x < data.length; x++) {
//         for (let y = 0; y < data[0].length; y++) {
//           this.calcNormalSourceXY(src, x, y, gridSize, data)
//         }
//       }
//     })
//   }

//   private static calcNormalSourceXY(source: LightSource, x: number, y: number, gridSize: number, data : number[][][]) {
//     // Check if this x  and y contain a light
//     const dist = source.location.distanceTo([x,y])
//     if (dist <= source.range) {
//       data[x][y][1] = this.calcLightValue(data[x][y][0], source.rangeEffect)
//     } else  if ( dist <= source.dimRange) {
//       data[x][y][1] = this.calcLightValue(data[x][y][0], source.dimRangeEffect)
//     } else {
//       data[x][y][1] = data[x][y][0]
//     }
//   }

//   public static calcLightValue(current: number, effect : RangeEffect) : number {
//     if (effect === RangeEffect.Plus1UpToNormal) {
//       return Math.min(LightLevel.Normal, current + 1)
//     }
//     if (effect === RangeEffect.Minus1) {
//       return Math.max(LightLevel.Dark, current - 1)
//     }
//     if (effect === RangeEffect.SetNormal) {
//       return LightLevel.Normal
//     }
//   }

//   public static calcMagical(sources: LightSource[], data: number[][][]) {
//     const magical = sources.filter(s => s.magicalLevel >= 0)
//     magical.forEach(src => {




//     })

//   }

// }