import { PolylineOptions, MarkerOptions, Circle, Polyline, Rectangle, Marker, polygon, polyline, rectangle, CircleMarkerOptions, LatLngExpression, circle, Polygon, ImageOverlay, LatLngBounds, imageOverlay, ImageOverlayOptions, LatLng, marker, latLngBounds, latLng } from "leaflet";
import { IconZoomLevelCache } from "./icon-cache";
import { IObjectType } from "./core";
import { LangUtil } from "../util/LangUtil";

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

/**
 * Annotations are things that go on the map. These can be shapes, markers, images, etc. 
 */
export abstract class Annotation implements IObjectType {
    public static readonly TYPE = 'db.Annotation'
    public static readonly FOLDER = 'annotations'

    static is(obj: any): obj is Annotation {
        return obj.objType !== undefined && obj.objType === Annotation.TYPE
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
    points: any[]

    // Do not save to database
    _leafletAttachment: any

    public setAttachment(item: any) {
        this._leafletAttachment = item
        this._leafletAttachment['title'] = this.name
    }

    public getAttachment(): any {
        return this._leafletAttachment
    }

    toLeaflet(iconCache: IconZoomLevelCache): any {
        if (!this._leafletAttachment) {
            this._leafletAttachment = this.createLeafletAttachment(iconCache)
            this._leafletAttachment.objAttach = this
        }
        return this._leafletAttachment
    }

    abstract copyPoints()
    abstract createLeafletAttachment(iconCache: IconZoomLevelCache): any
    abstract center(): LatLng
}

/**
 * Marker Type Annoations are instances of markers that use all the formating of 
 * a standard Marker Type. This is the preferred way of creating a markers.
 */
export class MarkerTypeAnnotation extends Annotation {


    public static readonly SUBTYPE = 'markerType'
    readonly subtype: string = MarkerTypeAnnotation.SUBTYPE

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

    }

    copyPoints() {
        let ll = this.toMarker().getLatLng()
        this.points = [ll]
    }

    private toMarker(): Marker {
        return this._leafletAttachment
    }

    options(iconCache: IconZoomLevelCache): MarkerOptions {
        let icn = iconCache.getAnyIcon(this.markerType)
        return {
            icon: icn
        }
    }

    createLeafletAttachment(iconCache: IconZoomLevelCache): any {
        const m = marker(this.points[0], this.options(iconCache))
        m['iconUrl'] = () => {
            return m.options.icon.options.iconUrl
        }
        return m
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

    copyOptionsFromShape() {

    }

    copyOptionsToShape() {

    }

    copyPoints() {
        this.points = [
            this._leafletAttachment.getBounds().getSouthWest(),
            this._leafletAttachment.getBounds().getNorthEast()
        ]
    }

    options(): ImageOverlayOptions {
        return {
            opacity: this.opacity
        }
    }

    private toImage(): ImageOverlay {
        let bounds = new LatLngBounds(this.points[0], this.points[1])
        let options = this.options()
        let img = imageOverlay(this.url, bounds, options)
        return undefined
    }

    createLeafletAttachment(iconCache: IconZoomLevelCache): any {

    }
    center(): LatLng {
        return undefined
    }
}

/**
 * Marker Annotations are custom markers
 */
// export class MarkerAnnotation extends Annotation {
//     public static readonly SUBTYPE = 'marker'
//     readonly subtype: string = MarkerAnnotation.SUBTYPE
//     static is(obj: any): obj is MarkerAnnotation {
//         return obj.objType !== undefined && obj.objType === Annotation.TYPE &&
//             obj.subtype !== undefined && obj.subtype === MarkerAnnotation.SUBTYPE
//     }

//     sizing: MarkerSizing


//     copyOptionsFromShape() {

//     }

//     copyOptionsToShape() {

//     }

//     copyPoints() {
//         this.points = [this._leafletAttachment.getLatLng()]
//     }

//     private toMarker(): Marker {
//         return undefined
//     }

//     // options(iconCache: IconZoomLevelCache): MarkerOptions {
//     //     let icn = iconCache.getAnyIcon(this.markerType)

//     //     return {
//     //         icon: icn
//     //     }
//     // }

//     createLeafletAttachment(iconCache: IconZoomLevelCache): any {

//     }

//     setLocation(location: LatLngExpression) {
//         this.points[0] = location
//         this.toMarker().setLatLng(location)
//     }

//     center(): LatLng {
//         return (<Marker>this._leafletAttachment).getLatLng()
//     }
// }

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
    }

    copyOptionsToShape() {
        // const opts = this.options()

        // this._leafletAttachment.options.stroke = opts.stroke
        // this._leafletAttachment.options.color = opts.color
        // this._leafletAttachment.options.opacity = opts.opacity
        // this._leafletAttachment.options.weight = opts.weight
        // this._leafletAttachment.options.fill = opts.fill
        // this._leafletAttachment.options.fillColor = opts.fillColor

        (<Polygon>this._leafletAttachment).setStyle(this.options())
        this._leafletAttachment.redraw()
    }

    copyPoints() {
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

    toShape(): Polygon | Polyline | Circle | Rectangle {
        if (this.type == 'polygon') {
            return this.toPolygon()
        } else if (this.type == 'polyline') {
            return this.toPolyline()
        } else if (this.type == 'rectangle') {
            return this.toRectangle()
        } else if (this.type === 'circle') {
            return this.toCircle()
        }
        throw new Error("Type not supported -> " + this.type);
    }

    private options(): PolylineOptions {
        let opts: PolylineOptions = {}
        opts.fill = this.fill
        opts.stroke = this.border
        opts.weight = this.weight

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

    private toPolygon(): Polygon {
        return polygon(this.points, this.options())
    }

    private toPolyline(): Polyline {
        return polyline(this.points, this.options())
    }

    private toRectangle(): Rectangle {
        if (this.points && this.points.length > 1) {
            return rectangle(this.points, this.options())
        } else {
            console.log("BAD RECT ", this)
            return rectangle([[0, 0], [1, 1]], this.options())
        }

    }

    private toCircle(): Circle {
        let options: CircleMarkerOptions = {
            fill: this.fill,
            fillColor: this.fillColor,
            stroke: this.border,
            color: this.color,
            weight: this.weight,
            radius: this.points[1]
        }
        let center: LatLngExpression = this.points[0]
        return circle(center, options)
    }

    createLeafletAttachment(iconCache: IconZoomLevelCache): any {
        return this.toShape()
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
        if (this._leafletAttachment._map == undefined) {
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

