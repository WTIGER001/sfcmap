import { ObjectType } from "./core";
import { MapSelectComponent } from "../controls/map-select/map-select.component";
import { Character } from "./character";
import { MapConfig } from "./map-config";
import { Encounter } from "../encounter/model/encounter";

export abstract class AssetOwner extends ObjectType {
  id: string
  name: string
  system: string = "pathfinder"
  description?: string
  weblink?: string
  tags: string[] = []
}


export class Game extends AssetOwner {
  public static readonly TYPE = 'db.Game'
  public static readonly FOLDER = 'games'
  readonly objType: string = Game.TYPE

  static is(obj: any): obj is Game {
    return obj.objType !== undefined && obj.objType === Game.TYPE
  }

  static to(obj: any): Game {
    return new Game().copyFrom(obj)
  }

 
  image: string
  players: string[]
  gms: string[]

  assetLinks : any = {
    comment : "assetlinks"
  }
}

export class AssetLink {
  /** The owner of the assets to be imported */
  ownerType: 'game' | 'gamesystem'
  owner: string

  /** The field to include */
  field: string
  values: string[] = []
}