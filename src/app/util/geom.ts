import { Path, SVG, svg } from "leaflet";
import { Annotation, ShapeAnnotation } from "../models";

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
}