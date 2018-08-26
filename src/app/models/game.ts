import { ObjectType } from "./core";
import { MapSelectComponent } from "../controls/map-select/map-select.component";
import { Character } from "./character";
import { MapConfig } from "./map-config";
import { Encounter } from "../encounter/model/encounter";

export class Game extends ObjectType {
  public static readonly TYPE = 'db.Game'
  public static readonly FOLDER = 'games'
  readonly objType: string = Game.TYPE

  static is(obj: any): obj is Game {
    return obj.objType !== undefined && obj.objType === Game.TYPE
  }

  static to(obj: any): Game {
    return new Game().copyFrom(obj)
  }

  id: string
  name: string
  system: string = "pathfinder"
  description?: string
  weblink: string
  tags: string[] = []
  edit: string[]
  view: string[]
  image: string
  players: string[]
  gms: string[]

  assetLinks : any = {
    comment : "assetlinks"
  }
  // Has
  /*
  maps
  characters
  encounters
  map types
  character types
  chats
  */
}

export class AssetLink {
  /** The owner of the assets to be imported */
  ownerType: 'game' | 'gamesystem'
  owner: string

  /** The field to include */
  field: string
  values: string[] = []
}