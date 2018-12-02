import { Path, SVG, svg, LatLngBounds, LatLng, latLng, latLngBounds } from "leaflet";
import { Annotation, ShapeAnnotation } from "../models";
import { log, isArray } from "util";
import { DistanceUnit } from "./transformation";

export class BoundsUtil {
  static offset(bounds: LatLngBounds, direction: number, distance: number, unit?: DistanceUnit): any {
    // 1, 4, 7 = LEFT
    // 9, 6, 3 = RIGHT
    // 7, 8, 9 = UP
    // 1, 2, 3 = DOWN

    let east = bounds.getEast() 
    let west = bounds.getWest() 
    let north = bounds.getNorth() 
    let south = bounds.getSouth()

    const dist = unit ? unit.toMeters(distance) : distance
    // Shift LEFT or RIGHT
    if ([1, 4, 7].includes(direction)) {
      east = east - dist
      west = west - dist
    } else if ([9, 6, 3].includes(direction)) {
      east = east + dist
      west = west + dist
    }

    // Shift UP or DOWN
    if ([7, 8, 9].includes(direction)) {
      north = north + dist
      south = south + dist
    } else if ([1, 2, 3].includes(direction)) {
      north = north - dist
      south = south - dist
    }

    const result = latLngBounds([south, west], [north, east])
    return result
  }


  /**
   * Creates an equal buffer around an existing bounds
   * @param bounds Input Bounds
   * @param bufferSize Size of the buffer (assumed to be meters)
   * @param unit Unit of the bufferSize
   */
  public static buffer(bounds: LatLngBounds, bufferSize: number, unit?: DistanceUnit): LatLngBounds {
    const buff = unit ? unit.toMeters(bufferSize) : bufferSize
    const east = bounds.getEast() + buff
    const west = bounds.getWest() - buff
    const north = bounds.getNorth() + buff
    const south = bounds.getSouth() - buff
    const result =  latLngBounds([south, west], [north, east])
    return result
  }


}

export class Rect {
  public x2: number
  public y2: number
  constructor(public x: number, public y: number, public width: number, public height: number) {
    this.x2 = x + width
    this.y2 = y + height
  }

  public static merge(...rects: Rect[]): Rect {
    if (rects.length <= 1) {
      return rects[0]
    }
    const returnRect = new Rect(rects[0].x, rects[0].y, rects[0].width, rects[0].height)


    for (let i = 1; i < rects.length; i++) {


      returnRect.x = Math.min(returnRect.x, rects[i].x)
      returnRect.y = Math.min(returnRect.y, rects[i].y)
      returnRect.x2 = Math.max(returnRect.x2, rects[i].x2)
      returnRect.y2 = Math.max(returnRect.y2, rects[i].y2)

    }

    returnRect.width = returnRect.x2 - returnRect.x
    returnRect.height = returnRect.y2 - returnRect.y


    return returnRect
  }

  public center(): [number, number] {
    return [this.x + this.width / 2, this.y + this.height / 2]
  }

  public static pad(src: Rect, pad: number): Rect {
    return Rect.fromEnds(src.x - pad, src.y - pad, src.x2 + pad, src.y2 + pad)
  }

  public static fromEnds(x: number, y: number, x2: number, y2: number) {
    return new Rect(x, y, x2 - x, y2 - y)
  }

  public static centerOn(bounds: LatLngBounds, center: LatLng, ): LatLngBounds {
    let halfLat = (bounds.getNorth() - bounds.getSouth()) / 2
    let halfLng = (bounds.getEast() - bounds.getWest()) / 2

    let sw = latLng(center.lat - halfLat, center.lng - halfLng)
    let ne = latLng(center.lat + halfLat, center.lng + halfLng)
    return latLngBounds(sw, ne)
  }

  public static multiply(bounds: LatLngBounds, factor: number): LatLngBounds {
    let center = bounds.getCenter()
    let halfLat = ((bounds.getNorth() - bounds.getSouth()) * factor) / 2
    let halfLng = ((bounds.getEast() - bounds.getWest()) * factor) / 2

    let sw = latLng(center.lat - halfLat, center.lng - halfLng)
    let ne = latLng(center.lat + halfLat, center.lng + halfLng)
    return latLngBounds(sw, ne)
  }

  public static limitSize(bounds: LatLngBounds, clientBounds: LatLngBounds, factor?: number) {
    factor = factor || 1
    let h = bounds.getNorth() - bounds.getSouth()
    let w = bounds.getEast() - bounds.getWest()

    let h2 = (clientBounds.getNorth() - clientBounds.getSouth()) * factor
    let w2 = (clientBounds.getEast() - clientBounds.getWest()) * factor

    let h3 = h
    let w3 = w
    let lat = bounds.getSouth()
    let lng = bounds.getWest()
    if (h > h2 || w > w2) {
      const diffH = h2 - h
      const diffW = w2 - w

      if (diffW > diffH) {
        h3 = h2
        w3 = (w / h) * h3
      } else {
        w3 = w2
        h3 = (h / w) * w3
      }
    }
    if (lat < clientBounds.getSouth()) {
      lat = clientBounds.getSouth()
    }
    if (lng < clientBounds.getWest()) {
      lng = clientBounds.getWest()
    }
    const result = latLngBounds(latLng(lat, lng), latLng(lat + h3, lng + w3))
    return result
  }

  public static fromBounds(bounds: LatLngBounds): Rect {
    const x = bounds.getWest()
    const y = bounds.getSouth()
    const x2 = bounds.getEast()
    const y2 = bounds.getNorth()
    const w = x2 - x
    const h = y2 - y
    return new Rect(x, y, w, h)
  }
}

export class Points {

  public static centerOn(center: LatLng, points: any): any {
    // Determine the center of the point array
    const bounding = Points.calcBounds(points)
    const origCenter = bounding.center()
    const biasX = center.lng - origCenter[0]
    const biasY = center.lat - origCenter[1]

    return Points.centerOn2(points, biasX, biasY)
  }

  private static centerOn2(points: any, biasX: number, biasY: number): any {
    // Loop through each point and calculate the offset from the center
    if (isArray(points)) {
      // This is an array so this has to be a recursive call
      let newArray = []
      points.forEach(item => {

        let newResult = this.centerOn2(item, biasX, biasY)

        newArray.push(newResult)
      })
      return newArray
    } else if (points.lat && points.lng) {
      // This is a lat / long object
      let offsetLat = biasY + points.lat
      let offsetLng = biasX + points.lng
      return { lat: offsetLat, lng: offsetLng }
    } else {
      return points
    }
  }

  public static calcBounds(points: any): Rect {

    if (isArray(points)) {
      // This is an array so this has to be a recursive call
      let newArray: Rect[] = []
      points.forEach(item => {
        let newResult = this.calcBounds(item)
        if (newResult) {
          newArray.push(newResult)
        }
      })
      return Rect.merge(...newArray)
    } else if (points.lat && points.lng) {
      // This is a lat / long object
      return new Rect(points.lng, points.lat, 0, 0)
    }
    return undefined
  }

  public static distance(location1: [number, number], location2: [number, number]): number {
    const x = location1[0] - location2[0]
    const y = location1[0] - location2[0]
    return Math.sqrt(x * x + y * y)
  }

  // Check if 2 lines intersect
  // https://stackoverflow.com/questions/3838329/how-can-i-check-if-two-segments-intersect
  public static instersects(X1: number, Y1: number, X2: number, Y2: number, X3: number, Y3: number, X4: number, Y4: number): boolean {

    const I1 = [Math.min(X1, X2), Math.max(X1, X2)]
    const I2 = [Math.min(X3, X4), Math.max(X3, X4)]

    if (Math.max(X1, X2) < Math.min(X3, X4)) {
      return false; // There is no mutual abcisses
    }

    const A1 = (X1 - X2) == 0 ? 0 : (Y1 - Y2) / (X1 - X2) // Pay attention to not dividing by zero
    const A2 = (X3 - X4) == 0 ? 0 : (Y3 - Y4) / (X3 - X4) // Pay attention to not dividing by zero
    const b1 = Y1 - A1 * X1
    const b2 = Y3 - A2 * X3

    if (A1 == A2) {
      return false; // Parallel segments
    }

    // const Ya = A1 * Xa + b1
    const Xa = (A1 - A2) == 0 ? 0 : (b2 - b1) / (A1 - A2) // Once again, pay attention to not dividing by zero

    if ((Xa < Math.max(Math.min(X1, X2), Math.min(X3, X4))) ||
      (Xa > Math.min(Math.max(X1, X2), Math.max(X3, X4)))) {
      return false; // intersection is out of bound
    } else {
      return true;
    }
  }
}


export interface IntersectPoint {
  x: number,
  y: number,
  param: number
}

// export class SightAndLight {


//   // Find intersection of RAY & SEGMENT
//   getIntersection(ray, segment): IntersectPoint {

//     // RAY in parametric: Point + Delta*T1
//     var r_px = ray.a.x;
//     var r_py = ray.a.y;
//     var r_dx = ray.b.x - ray.a.x;
//     var r_dy = ray.b.y - ray.a.y;

//     // SEGMENT in parametric: Point + Delta*T2
//     var s_px = segment.a.x;
//     var s_py = segment.a.y;
//     var s_dx = segment.b.x - segment.a.x;
//     var s_dy = segment.b.y - segment.a.y;

//     // Are they parallel? If so, no intersect
//     var r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
//     var s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
//     if (r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag) {
//       // Unit vectors are the same.
//       return null;
//     }

//     // SOLVE FOR T1 & T2
//     // r_px+r_dx*T1 = s_px+s_dx*T2 && r_py+r_dy*T1 = s_py+s_dy*T2
//     // ==> T1 = (s_px+s_dx*T2-r_px)/r_dx = (s_py+s_dy*T2-r_py)/r_dy
//     // ==> s_px*r_dy + s_dx*T2*r_dy - r_px*r_dy = s_py*r_dx + s_dy*T2*r_dx - r_py*r_dx
//     // ==> T2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx)
//     var T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / (s_dx * r_dy - s_dy * r_dx);
//     var T1 = (s_px + s_dx * T2 - r_px) / r_dx;

//     // Must be within parametic whatevers for RAY/SEGMENT
//     if (T1 < 0) return null;
//     if (T2 < 0 || T2 > 1) return null;

//     // Return the POINT OF INTERSECTION
//     return {
//       x: r_px + r_dx * T1,
//       y: r_py + r_dy * T1,
//       param: T1
//     };

//   }

//   ///////////////////////////////////////////////////////

//   draw(canvas: HTMLCanvasElement) {

//     // DRAWING
//     var ctx = canvas.getContext("2d");
//     function draw() {

//       // Clear canvas
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // Draw segments
//       ctx.strokeStyle = "#999";
//       for (var i = 0; i < segments.length; i++) {
//         var seg = segments[i];
//         ctx.beginPath();
//         ctx.moveTo(seg.a.x, seg.a.y);
//         ctx.lineTo(seg.b.x, seg.b.y);
//         ctx.stroke();
//       }

//       // Get all unique points
//       var points = (function (segments) {
//         var a = [];
//         segments.forEach(function (seg) {
//           a.push(seg.a, seg.b);
//         });
//         return a;
//       })(segments);
//       var uniquePoints = (function (points) {
//         var set = {};
//         return points.filter(function (p) {
//           var key = p.x + "," + p.y;
//           if (key in set) {
//             return false;
//           } else {
//             set[key] = true;
//             return true;
//           }
//         });
//       })(points);

//       // Get all angles
//       var uniqueAngles = [];
//       for (var j = 0; j < uniquePoints.length; j++) {
//         var uniquePoint = uniquePoints[j];
//         var angle = Math.atan2(uniquePoint.y - Mouse.y, uniquePoint.x - Mouse.x);
//         uniquePoint.angle = angle;
//         uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001);
//       }

//       // RAYS IN ALL DIRECTIONS
//       var intersects = [];
//       for (var j = 0; j < uniqueAngles.length; j++) {
//         var angle = uniqueAngles[j];

//         // Calculate dx & dy from angle
//         var dx = Math.cos(angle);
//         var dy = Math.sin(angle);

//         // Ray from center of screen to mouse
//         var ray = {
//           a: { x: Mouse.x, y: Mouse.y },
//           b: { x: Mouse.x + dx, y: Mouse.y + dy }
//         };

//         // Find CLOSEST intersection
//         var closestIntersect = null;
//         for (var i = 0; i < segments.length; i++) {
//           var intersect = getIntersection(ray, segments[i]);
//           if (!intersect) continue;
//           if (!closestIntersect || intersect.param < closestIntersect.param) {
//             closestIntersect = intersect;
//           }
//         }

//         // Intersect angle
//         if (!closestIntersect) continue;
//         closestIntersect.angle = angle;

//         // Add to list of intersects
//         intersects.push(closestIntersect);

//       }

//       // Sort intersects by angle
//       intersects = intersects.sort(function (a, b) {
//         return a.angle - b.angle;
//       });

//       // DRAW AS A GIANT POLYGON
//       ctx.fillStyle = "#dd3838";
//       ctx.beginPath();
//       ctx.moveTo(intersects[0].x, intersects[0].y);
//       for (var i = 1; i < intersects.length; i++) {
//         var intersect = intersects[i];
//         ctx.lineTo(intersect.x, intersect.y);
//       }
//       ctx.fill();

//       // DRAW DEBUG LINES
//       ctx.strokeStyle = "#f55";
//       for (var i = 0; i < intersects.length; i++) {
//         var intersect = intersects[i];
//         ctx.beginPath();
//         ctx.moveTo(Mouse.x, Mouse.y);
//         ctx.lineTo(intersect.x, intersect.y);
//         ctx.stroke();
//       }

//     }

//     // LINE SEGMENTS
//     var segments = [

//       // Border
//       { a: { x: 0, y: 0 }, b: { x: 640, y: 0 } },
//       { a: { x: 640, y: 0 }, b: { x: 640, y: 360 } },
//       { a: { x: 640, y: 360 }, b: { x: 0, y: 360 } },
//       { a: { x: 0, y: 360 }, b: { x: 0, y: 0 } },

//       // Polygon #1
//       { a: { x: 100, y: 150 }, b: { x: 120, y: 50 } },
//       { a: { x: 120, y: 50 }, b: { x: 200, y: 80 } },
//       { a: { x: 200, y: 80 }, b: { x: 140, y: 210 } },
//       { a: { x: 140, y: 210 }, b: { x: 100, y: 150 } },

//       // Polygon #2
//       { a: { x: 100, y: 200 }, b: { x: 120, y: 250 } },
//       { a: { x: 120, y: 250 }, b: { x: 60, y: 300 } },
//       { a: { x: 60, y: 300 }, b: { x: 100, y: 200 } },

//       // Polygon #3
//       { a: { x: 200, y: 260 }, b: { x: 220, y: 150 } },
//       { a: { x: 220, y: 150 }, b: { x: 300, y: 200 } },
//       { a: { x: 300, y: 200 }, b: { x: 350, y: 320 } },
//       { a: { x: 350, y: 320 }, b: { x: 200, y: 260 } },

//       // Polygon #4
//       { a: { x: 340, y: 60 }, b: { x: 360, y: 40 } },
//       { a: { x: 360, y: 40 }, b: { x: 370, y: 70 } },
//       { a: { x: 370, y: 70 }, b: { x: 340, y: 60 } },

//       // Polygon #5
//       { a: { x: 450, y: 190 }, b: { x: 560, y: 170 } },
//       { a: { x: 560, y: 170 }, b: { x: 540, y: 270 } },
//       { a: { x: 540, y: 270 }, b: { x: 430, y: 290 } },
//       { a: { x: 430, y: 290 }, b: { x: 450, y: 190 } },

//       // Polygon #6
//       { a: { x: 400, y: 95 }, b: { x: 580, y: 50 } },
//       { a: { x: 580, y: 50 }, b: { x: 480, y: 150 } },
//       { a: { x: 480, y: 150 }, b: { x: 400, y: 95 } }

//     ];

//     // // DRAW LOOP
//     // window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
//     // var updateCanvas = true;
//     // function drawLoop() {
//     //   requestAnimationFrame(drawLoop);
//     //   if (updateCanvas) {
//     //     draw();
//     //     updateCanvas = false;
//     //   }
//     // }
//     // window.onload = function () {
//     //   drawLoop();
//     // };

//     // // MOUSE	
//     // var Mouse = {
//     //   x: canvas.width / 2,
//     //   y: canvas.height / 2
//     // };
//     // canvas.onmousemove = function (event) {
//     //   Mouse.x = event.clientX;
//     //   Mouse.y = event.clientY;
//     //   updateCanvas = true;
//     // };








//   }