import { GameSystem } from "../game-system";

export class Pathfinder {
  static make(): GameSystem {
    const gs = new GameSystem()

    gs.id = "pathfinder"
    gs.name = "Pathfinder"
    gs.logo = "/assets/logos/pathfinder.png"
    gs.description = "Pathfinder Role-Playing Game by Piazo"
    gs.tags = ['Fantasy', 'Paizo']
    gs.supports = ['monsters', 'spells', 'feats', 'npcs', 'items']
    gs.health = 'HP'
    gs.defense = 'AC'
    gs.commonAttributes = ['HP', 'AC', 'Initative', 'STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA', 'Fort', 'Ref', 'Will', 'Touch AC', 'Flat AC', 'BAB', 'CMB', 'CMD']
    gs.commonRolls = ['Perception', 'Attack - Melee', 'Initative', 'Attack - Ranged']

    return gs;
  }
}