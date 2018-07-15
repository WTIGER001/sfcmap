import { IObjectType } from "./core";

/**
 * A type of map. For example: World / Continent, City / Town, Building Interior, 
 */
export class MapType implements IObjectType {
    public static readonly TYPE = 'db.MapType'
    public static readonly FOLDER = 'mapTypes'

    // TypeScript guard
    static is(obj: any): obj is MapType {
        return obj.objType !== undefined && obj.objType === MapType.TYPE
    }

    dbPath(): string {
        return MapType.FOLDER + "/" + this.name
    }

    readonly objType: string = MapType.TYPE

    id: string
    name: string
    order: number
    defaultMarker?: string
}
