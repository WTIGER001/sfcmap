import { IObjectType, ObjectType, Asset } from "./core";

/**
 * A type of map. For example: World / Continent, City / Town, Building Interior, 
 */
export class MapType extends Asset {
    public static readonly TYPE = 'db.MapType'
    public static readonly FOLDER = 'mapTypes'
    readonly objType: string = MapType.TYPE

    // TypeScript guard
    static is(obj: any): obj is MapType {
        return obj.objType !== undefined && obj.objType === MapType.TYPE
    }

    static to(obj: any): MapType {
        return new MapType().copyFrom(obj)
    }

    dbPath(): string {
        return MapType.FOLDER + "/" + this.id
    }

    id: string
    name: string
    order: number
    defaultMarker?: string
}
