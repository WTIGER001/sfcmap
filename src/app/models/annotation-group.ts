import { IRestrictedItem, IDbItem, IObjectType } from "./core";
import { Annotation } from "./annotations";

export class MarkerGroup implements IRestrictedItem, IDbItem, IObjectType {
    public static readonly TYPE = 'db.MarkerGroup'
    public static readonly FOLDER = 'markerGroups'
    public static readonly SAMPLE = {
        objType: '',
        id: 'string',
        name: 'string',
        description: 'string',
        map: 'string',
        edit: [],
        view: [],
    }

    // TypeScript guard
    static is(obj: any): obj is MarkerGroup {
        return obj.objType !== undefined && obj.objType === MarkerGroup.TYPE
    }

    dbPath(): string {
        return MarkerGroup.FOLDER + '/' + this.map + "/" + this.id
    }

    readonly objType: string = MarkerGroup.TYPE
    id: string
    name: string
    description: string

    /**
     * The id of the map that this group is associated to
     */
    map: string
    edit: string[]
    view: string[]
    showText: boolean = false
    textStyle: string = 'sfc-tooltip-default'
    // markers: SavedMarker[]
    _annotations: Annotation[]
}
