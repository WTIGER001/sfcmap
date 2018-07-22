import { Path, SVG, svg, LatLngBounds, LatLng, latLng, latLngBounds } from "leaflet";
import { Annotation, ShapeAnnotation } from "../models";
import { log } from "util";

export class Rect {
    public x2: number
    public y2: number
    constructor(public x: number, public y: number, public width: number, public height: number) {
        this.x2 = x + width
        this.y2 = y + height
    }

    public static pad(src: Rect, pad: number): Rect {
        return Rect.fromEnds(src.x - pad, src.y - pad, src.x2 + pad, src.y2 + pad)
    }

    public static fromEnds(x: number, y: number, x2: number, y2: number) {
        return new Rect(x, y, x2 - x, y2 - y)
    }

    public static centerOn(bounds: LatLngBounds, inside: LatLngBounds, ): LatLngBounds {
        let halfLat = (bounds.getNorth() - bounds.getSouth()) / 2
        let halfLng = (bounds.getEast() - bounds.getWest()) / 2
        let center = inside.getCenter()

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