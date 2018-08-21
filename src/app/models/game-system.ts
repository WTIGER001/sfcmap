import { Roll } from "./character";
import { ObjectType } from "./core";

export class GameSystem extends ObjectType {
  public static readonly TYPE = 'db.GameSystem'
  public static readonly FOLDER = 'game-systems'
  readonly objType: string = GameSystem.TYPE

  static is(obj: any): obj is GameSystem {
    return obj.objType !== undefined && obj.objType === GameSystem.TYPE
  }

  static to(obj: any): GameSystem {
    return new GameSystem().copyFrom(obj)
  }

  id: string
  name: string
  description: string
  logo: string
  tags: string[]
  theme?: string
  edit?: string[]
  view?: string[]
  weblink?: string

  supports?: string[]
  health: string
  defense: string
  commonAttributes?: string[]
  commonRolls?: string[]

  // has
  /*
  monsters
  npcs
  spells
  items
  */
  static build(obj: any): GameSystem {
    const gs = new GameSystem()
    Object.assign(this, obj)
    return gs
  }
}

export class PrimaryAttribute {
  attr: string
  shape: 'heart' | 'shield' | 'rectangle' | 'circle'

}


// export const Pathfinder: GameSystem = GameSystem.build({
//   objType: GameSystem.TYPE,
//   id: "pathfinder",
//   name: "Pathfinder",
//   description: "Pathfinder Role-Playing Game by Piazo",
//   tags: ['Fantasy', 'Paizo'],
//   logo: "/assets/logos/pathfinder.png",
//   supports: ['monsters', 'spells', 'feats', 'npcs', 'items'],
//   health: 'HP',
//   defense: 'AC',
//   commonAttributes: ['HP', 'AC', 'Initative', 'STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA', 'Fort', 'Ref', 'Will', 'Touch AC', 'Flat AC', 'BAB', 'CMB', 'CMD'],
//   commonRolls: ['Perception', 'Attack - Melee', 'Initative', 'Attack - Ranged']
// })
