import { Asset } from "../models";

export class Monster extends Asset {
  public static readonly TYPE = 'db.Monster'
  public static readonly FOLDER = 'monster'
  public static readonly RESTRICT = ['name', 'Visual Description', 'description', 'cr', 'image', 'alignment', 'size', 'type', 'init', 'senses', 'perception', 'ac',
    'hp', 'Hit Dice', 'saves', 'resist', 'speed', 'ranged', 'melee', 'special attacks', 'spell like abilities', 'HP Mod', 
    'Special Abilities', 'Spell Resistance', 'Offense', 'Spells', 'Feats', 'Weaknesses']
  readonly objType: string = Monster.TYPE

  // TypeScript guard
  static is(obj: any): obj is Monster {
    return obj.objType !== undefined && obj.objType === Monster.TYPE
  }

  static to(obj: any): Monster {
    return obj
  }

  image : string
  thumb: string

  name : string
  cr: string
  xp: number
  race: string
  class: string
  monstersource: string
  alignment: string
  size: string
  type: string
  subtype: string
  init: string
  senses: string
  aura: string
  ac: number
  acTouch : number
  acFlat : number
  ac_mods:  string
  hp  : number
  hd: string
  hp_mods: string
  fort : number
  ref : number
  will : number
  save_mods: string
  defensiveabilities: string
  dr: string
  immune: string
  resist: string
  sr: string
  weaknesses: string
  speed: string
  speed_mod: string
  melee: string
  ranged: string
  space: string
  reach: string
  specialAttacks: string
  spellLikeAbilities: string
  spellsKnown: string
  spellsPrepared: string
  spellDomains: string
  abilityScores: string
  abilityScore_mods: string
  baseAtk: string
  cmb: string
  cmd: string
  feats: string
  skills: string
  racialMods: string
  languages: string
  sq: string
  environment: string
  organization: string
  treasure: string
  description_visual: string
  group: string
  source: string
  isTemplate: boolean
  specialAbilities: KeyValue[]
  description: string
  gender: string
  bloodline: string
  prohibitedSchools: string
  beforeCombat: string
  duringCombat: string
  morale: string
  gear: string
  otherGear: string
  vulnerability: string
  note: string
  characterflag : boolean
  companionflag : boolean
  fly: boolean
  climb: boolean
  burrow: boolean
  swim: boolean
  land: boolean
  templatesapplied: string
  offensenote: string
  basestatistics: string
  extractsprepared: string
  agecategory: string
  mystery: string
  classarchetypes: string
  patron: string
  alternatenameform: string
  id: string
  uniquemonster :boolean
  mr: number
  mythic : boolean
  fullText : string
}

export class KeyValue {
  constructor(public key: string, public value: string) { }
}