import { Asset } from "../models";


export class Item extends Asset {
  public static readonly TYPE = 'db.item'
  public static readonly FOLDER = 'items'
  public static readonly RESTRICTABLE = ['description', 'alignment']
  readonly objType: string = Item.TYPE

  static is(obj: any): obj is Item {
    return obj.objType !== undefined && obj.objType === Item.TYPE
  }

  static to(obj: any): Item {
    return new Item().copyFrom(obj)
  }

  image: string
  thumb: string

  aura: string
  cl: string
  slot: string
  price: string
  weight: string
  requirements: string
  cost: string
  group: string
  source: string
  alignment: string
  int: number
  wis: number
  cha: number
  ego: string
  communication: string
  senses: string
  powers: string
  magicItems: string
  fulltext: string
  destruction: string
  minorArtifactFlag: boolean
  majorArtifactFlag: boolean
  abjuration: boolean
  conjuration: boolean
  divination: boolean
  enchantment: boolean
  evocation: boolean
  necromancy: boolean
  transmutation: boolean
  auraStrength: string
  weightValue: number
  priceValue: number
  costValue: number
  languages: string
  baseItem: string
  linkText: string
  id: string
  mythic: boolean
  legendaryWeapon: boolean
  illusion: boolean
  universal: boolean
  scaling: string
}

