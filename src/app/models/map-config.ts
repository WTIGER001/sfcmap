import { IObjectType } from "./core";

/**
 * A configuration for a map.
 */
export class MapConfig implements IObjectType {
    public static readonly TYPE = 'db.Map'
    public static readonly FOLDER = 'maps'

    // TypeScript guard
    static is(obj: any): obj is MapConfig {
        return obj.objType !== undefined && obj.objType === MapConfig.TYPE
    }

    dbPath(): string {
        return MapConfig.FOLDER + "/" + this.name
    }

    readonly objType: string = MapConfig.TYPE
    id: string
    mapType: string
    name: string
    description?: string
    defaultMarker?: string
    ppm: number
    image: string  /// Calculated
    thumb: string   /// Calculated
    width: number   /// Calculated
    height: number  /// Calculated
    view: string[]
    edit: string[]
    gridOptions: any
}