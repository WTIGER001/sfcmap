import { IObjectType } from "./core";

/** 
 * A Marker Category is a group that markers are placed into. 
*/
export class MarkerCategory implements IObjectType {
    public static readonly TYPE = 'db.MarkerCategory'
    public static readonly FOLDER = 'markerCategories'
    // TypeScript guard
    static is(obj: any): obj is MarkerCategory {
        return obj.objType !== undefined && obj.objType === MarkerCategory.TYPE
    }

    dbPath(): string {
        return MarkerCategory.FOLDER + "/" + this.name
    }

    readonly objType: string = MarkerCategory.TYPE
    id: string
    name: string
    icon?: string
    appliesTo: string[]
}