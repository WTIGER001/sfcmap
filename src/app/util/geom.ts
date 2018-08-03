import { Path, SVG, svg, LatLngBounds, LatLng, latLng, latLngBounds } from "leaflet";
import { Annotation, ShapeAnnotation } from "../models";
import { log, isArray } from "util";



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
    console.log("ORIG RECT : ", returnRect);


    for (let i = 1; i < rects.length; i++) {
      console.log("Comparing : ", returnRect, rects[i]);

      returnRect.x = Math.min(returnRect.x, rects[i].x)
      returnRect.y = Math.min(returnRect.y, rects[i].y)
      returnRect.x2 = Math.max(returnRect.x2, rects[i].x2)
      returnRect.y2 = Math.max(returnRect.y2, rects[i].y2)
      console.log("RECT : ", returnRect);
    }

    returnRect.width = returnRect.x2 - returnRect.x
    returnRect.height = returnRect.y2 - returnRect.y

    console.log("FINISHED RECT : ", returnRect);

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
    console.log("INPUTS : ", bounds, clientBounds, factor);
    console.log("H/W : ", h, " ", w);

    let h2 = (clientBounds.getNorth() - clientBounds.getSouth()) * factor
    let w2 = (clientBounds.getEast() - clientBounds.getWest()) * factor
    console.log("H2/W2 : ", h2, " ", w2);

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
        console.log("Center on ", item);
        let newResult = this.centerOn2(item, biasX, biasY)
        console.log("Result ", newResult);
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


}