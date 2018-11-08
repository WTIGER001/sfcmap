import { Asset } from "../../models";
import { MapShareData } from "src/app/models/system-models";

export class Encounter extends Asset {
  public static readonly TYPE = 'db.Encounter'
  public static readonly FOLDER = 'encounters'
  readonly objType: string = Encounter.TYPE

  static is(obj: any): obj is Encounter {
    return obj.objType !== undefined && obj.objType === Encounter.TYPE
  }

  static to(obj: any): Encounter {
    return new Encounter().copyFrom(obj)
  }

  static folder(obj: Encounter) {
    return Encounter.FOLDER
  }

  static path(obj: Encounter) {
    return Encounter.folder(obj) + "/" + obj.id
  }

  tags: string[]

  /**
   * Flag to indicate if this encounter has been completed
   */
  completed: boolean

  /** 
   * Map information (map, zoom, pan, etc)
   */
  mapInfo: MapShareData

  /**
   * The Tokens that are part of the encounter. 
   */
  participants: TokenRecord[] = []

  /**
   * Notes for the Game Master. These are always hidden
   */
  gmNotes: string

  /** 
   * Date this was completed
   */
  completedDate: Date

  /**
   * The current Round
   */
  round: number = 1;

  /**
   * The person that has the current turn
   */
  turn: number = 0;

}

export class TokenRecord {
  badge: string
  itemid: string
  id: string // Id of the item. This could be a character, monster or token (how to handle multiple)
  name: string
  type: string // The type of the item (e.g. Character.TYPE)
  team: string // The team for the item
  xp: number // The XP award
  treasure: any // The Treasure that the item is carrying
  hp: number // the HP for the item (if applicable)
  maxHp: number // the Max HP for the item (if applicable)
  statuses: string[] = [] // the status effects for the item (if applicable) 
  controlledBy: string[] = ['GM'] // Who controls this. Valid values are 'everyone', 'gm' and/or player ids
  initiative: number = 0 // The initiative order 
  token: string;
  _delete: boolean = false
  dead: false
}