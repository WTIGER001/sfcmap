import { Distance, BarrierAnnotation, TokenAnnotation, MapLighting, LightSource, LightLevel, Vision } from "../models";
import { AuraVisibleTo, AuraVisible } from "../models/aura";
import { Point, ImageOverlay, latLngBounds, LatLng, point, Map, imageOverlay, latLng } from "leaflet";
import * as _ from 'lodash'
import { MapService } from "./map.service";
import { ImageUtil } from "../util/ImageUtil";
import { Rect } from "../util/geom";
import { DataService } from "../data.service";
import { tap, filter } from "rxjs/operators";
import { Token } from "@angular/compiler";


/**
 * Manages the lighting on the map
 */
export class LightImageRenderer {
  private imgOverlay: ImageOverlay

  barriers : BarrierAnnotation[] = []
  lights: TokenAnnotation[]= []
  barrierSegments = []
  viewers:  TokenAnnotation[] =[]

  constructor(private mapSvc : MapService, private data : DataService) {

    this.mapSvc.mapConfig.pipe(
      tap(m => console.log('_____________________Recieved new map')),
      tap(m => this.update())
    ).subscribe()

    this.data.gameAssets.maps.items$.pipe(
      tap(m => console.log('_____________________Recieved new Maps from DB')),
      filter(m => this.mapSvc._mapCfg != undefined),
      tap(m => this.update())
    ).subscribe()

    this.mapSvc.annotationAddUpate.pipe(
      tap(m => console.log('_____________________Recieved new annotation from DB')),
      tap(m => this.update())

    ).subscribe()

    this.mapSvc.annotationDelete.pipe(
      tap(m => console.log('_____________________Recieved deleted annotation from DB')),
      tap(m => this.update())
    ).subscribe()
  }

  public update() {
    // Get the context
    const map = this.mapSvc._map
    let factor = this.mapSvc._mapCfg.ppm
    const llBounds = latLngBounds([[0, 0], [this.mapSvc._mapCfg.height / factor, this.mapSvc._mapCfg.width / factor]]);

    const bounds = new Rect(0, 0, this.mapSvc._mapCfg.width, this.mapSvc._mapCfg.height)

    const canvas = ImageUtil.offscreen()
    canvas.width = bounds.width
    canvas.height = bounds.height

    const ctx = canvas.getContext('2d')
    ctx.save()

    if (this.mapSvc._mapCfg.enableLighting) {
      console.log('______________ Starting Light Render')
      // Flip the image vertically to match the leaflet approach
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
    
      // Draw the Ambient Light color
      console.log('______________ Drawing Ambient')
      this.drawAmbient(ctx, canvas)

      // Calculate the Mask as polygons
      this.readModels()
      this.buildSegments()

      // Draw the mask, lights and vision
      console.log('______________ Drawing Viewers...', this.viewers.length)

      this.viewers.forEach( v => {
        const mask = this.calculateMaskForViewer(v)
        this.drawMask(ctx, mask)
        this.drawLights(ctx)
        // this.drawVision(ctx, v)
      })

      console.log('______________ Rendering Image...')


      // Create / Update the Image Overlay
      const data = canvas.toDataURL()
      if (this.imgOverlay) {
        this.imgOverlay.setUrl(data)
      } else {
        this.imgOverlay = imageOverlay(data, llBounds, { pane: 'fow', interactive: !this.data.isGM() })
      }

      console.log('______________ Adding to Map')

      this.imgOverlay.addTo(map)
    } else if (this.imgOverlay) {

      console.log('______________ Lighting Disabled, removing from map')
      this.imgOverlay.remove()
    }

    ctx.restore()
  }


  private readModels() {
    const lights: TokenAnnotation[] = []
    const barriers : BarrierAnnotation[] = []
    const viewers : TokenAnnotation[] = []

    const all = this.mapSvc.annotationsFromMap()
    all.forEach( a => {
      if (TokenAnnotation.is(a)) {
        if (a.vision && a.vision.enabled) {
          viewers.push(a)
        }
        if (a.lights && a.lights.length > 0) {
          lights.push(a)
        }
      } else if (BarrierAnnotation.is(a)) {
        if (a.enabled) {
          barriers.push(a)
        }
      }
    })

    this.barriers = barriers
    this.lights = lights
    this.viewers = viewers

    // HACK 
    // 39, 37
    const hack  = new TokenAnnotation()
    hack.points = [latLng(37, 39)]
    hack.vision = new Vision()
    this.viewers.push(hack)
  }

  private buildSegments() {
    const segments = []
    // Build the segments for the map border
    let ppm = this.mapSvc._mapCfg.ppm

    const w= this.mapSvc._mapCfg.width * ppm
    const h = this.mapSvc._mapCfg.height * ppm

    segments.push({ a: { x: 0, y: 0 }, b: { x: w, y: 0 } })
    segments.push({ a: { x: w, y: 0 }, b: { x: w, y: h } })
    segments.push({ a: { x: w, y: h }, b: { x: w, y: h } })
    segments.push({ a: { x: 0, y: h }, b: { x: 0, y: 0 } })

    // add in each barrier
    this.barriers.forEach( b => {
      const pts : LatLng[] =  b.points
      for (let i =0; i<pts.length-1; i++) {
        segments.push({ a: { x: pts[i].lng * ppm, y: pts[i].lat * ppm }, b: { x: pts[i + 1].lng * ppm, y: pts[i + 1].lat * ppm} })
      }
    })
    this.barrierSegments = segments

    console.log('______________ Segments', this.barrierSegments)
  }

  private drawAmbient(ctx : CanvasRenderingContext2D, canvas : HTMLCanvasElement) {
    ctx.fillStyle = this.getColor(this.mapSvc._mapCfg.ambientLight)
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  private getColor(level : LightLevel) : string {
    const settings = new MapLighting()
    if (level == LightLevel.Bright) {
      return settings.clrBright
    }
    if (level == LightLevel.Dark) {
      return settings.clrDark
    }
    if (level == LightLevel.Dim) {
      return settings.clrDim
    }
    if (level == LightLevel.MagicalDark) {
      return settings.clrMagicDark
    }
    if (level == LightLevel.Normal) {
      return settings.clrNormal
    }
    return '#FF69B4' // HOT PINK... This should indicate an error :)
  }

  // Basd on where this token is create amask
  private calculateMaskForViewer(viewer : TokenAnnotation) : Intersection[]{

    // const ll = viewer.center()
    const ll = viewer.points[0]
    const viewerLocation = this.toPoint(ll)
    const rtn = VisionUtil.calculateIntersects(viewerLocation, this.barrierSegments)

    console.log('______________ MASK ', rtn)


    return rtn
  }

  private drawMask(ctx: CanvasRenderingContext2D, points: Intersection[]) {
    ctx.beginPath()

    ctx.moveTo(points[0].x, points[0].y)
    points.unshift()
    points.forEach( p => ctx.lineTo(p.x, p.y))
    ctx.closePath()
    ctx.clip()
  }

  private drawLights(ctx: CanvasRenderingContext2D) {
    this.lights.forEach( token => {
      const location = this.toPoint(token.center())
      token.lights.forEach ( light => {
        this.drawLightSource(light, location, ctx, true)
        this.drawLightSource(light, location, ctx)
      })
    })
  }

  private drawLightSource(light : LightSource, location: Point, ctx : CanvasRenderingContext2D, dim ?: boolean) {
    if ( !dim || light.dimRange > light.range) {
      console.log('______________ Drawing Light ', light, location)

      // Set the color or gradient
      // ctx.fillStyle = '#ffff0050'
      ctx.fillStyle = dim ? this.getColor(LightLevel.Dim) : this.getColor(LightLevel.Normal) 

      // Draw the arc
      const range = (dim ? light.dimRange : light.range)
      const startRad = Math.PI / 180 * light.angleStart
      const endRad = Math.PI / 180 * light.angleEnd

      // Cut the arc out
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(location.x, location.y, range, startRad, endRad, false)
      ctx.fill()

      ctx.globalCompositeOperation = 'source-over'
      ctx.beginPath()
      ctx.arc(location.x, location.y, range, startRad, endRad, false)
      ctx.fill()
    }
  }

  private drawVision(ctx: CanvasRenderingContext2D, viewer : TokenAnnotation) {
    const vision = viewer.vision
    if (!vision ||!vision.enabled) {
      return
    }

    if (this.mapSvc._mapCfg.ambientLight >= LightLevel.Dim) {
      // No need to draw
      return
    }

    // UGG Not sure how to determine lowlight
    if (this.mapSvc._mapCfg.ambientLight == LightLevel.Dim) {
      // Draw 
    }
    const location = this.toPoint(viewer.center())
    if (this.mapSvc._mapCfg.ambientLight == LightLevel.Dark && vision.dark ) {
      // Draw 
      // Set the color or gradient
      ctx.fillStyle = 'yellow'

      ctx.arc(location.x, location.y, vision.darkRange, 0, 2*Math.PI, false)
      ctx.fill()
    }
  }

  toPoint(ll : LatLng) : Point {
    let ppm = this.mapSvc._mapCfg.ppm
    return new Point(ll.lng * ppm, ll.lat * ppm)
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