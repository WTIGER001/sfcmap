import { IObjectType, ObjectType, Asset } from "./core";

/**
 * A configuration for a map.
 */
export class MapConfig extends Asset {
  public static readonly TYPE = 'db.Map'
  public static readonly FOLDER = 'maps'
  readonly objType: string = MapConfig.TYPE

  // TypeScript guard
  static is(obj: any): obj is MapConfig {
    return obj.objType !== undefined && obj.objType === MapConfig.TYPE
  }

  static to(obj: any): MapConfig {
    return new MapConfig().copyFrom(obj)
  }

  dbPath(): string {
    return MapConfig.FOLDER + "/" + this.id
  }

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
  tags: string[]
  gridOptions: any
  game: string = 'NONE_YET'
}