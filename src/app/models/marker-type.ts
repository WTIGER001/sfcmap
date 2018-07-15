import { IObjectType } from "./core";
import { AnchorPostitionChoice } from "./annotations";

/**
 * A Marker Type is a type of marker that can be placed. This type brings with it the icon and category
 */
export class MarkerType implements IObjectType {
    public static readonly TYPE = 'db.MarkerType'
    public static readonly FOLDER = 'markerTypes'
    // TypeScript guard
    static is(obj: any): obj is MarkerType {
        return obj.objType !== undefined && obj.objType === MarkerType.TYPE
    }

    dbPath(): string {
        return MarkerType.FOLDER + "/" + this.name
    }

    readonly objType: string = MarkerType.TYPE

    id: string
    name: string
    category: string
    iconSize: [number, number]
    iconAnchor: [number, number]    // point of the icon which will correspond to marker's location
    url?: string
    zoomLevelForOriginalSize: number = 1
    zoomRange: [number, number] = [-20, 200]
    displayRange: [number, number] = [-20, 200]
    sizing: string = 'fixed'
    anchorPosition: AnchorPostitionChoice = AnchorPostitionChoice.MiddleCenter
}