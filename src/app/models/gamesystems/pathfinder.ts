import { BehaviorSubject } from "rxjs";
import { CachedItem } from "src/app/cache/cache";
import { CacheService } from "src/app/cache/cache.service";
import { Monster } from "src/app/monsters/monster";
import { DistanceUnit } from "src/app/util/transformation";
import { GameSystem, NameDescription, TokenSize } from "../game-system";
import { AngularFireDatabase } from "@angular/fire/database";

export class Pathfinder extends GameSystem {
  static readonly MONSTER_PATH = "cache/games/pathfinder/monsters"

  monsters$: BehaviorSubject<Monster[]> = new BehaviorSubject([])

  readonly id = "pathfinder"
  name = "Pathfinder"
  image = "/assets/logos/pathfinder.png"
  description = "Pathfinder Role-Playing Game by Piazo"
  tags = ['Fantasy', 'Paizo']
  supports = ['monsters', 'spells', 'feats', 'npcs', 'items']
  health = 'HP'
  defense = 'AC'
  commonAttributes = ['HP', 'AC', 'Initative', 'STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA', 'Fort', 'Ref', 'Will', 'Touch AC', 'Flat AC', 'BAB', 'CMB', 'CMD']
  commonRolls = ['Perception', 'Attack - Melee', 'Initative', 'Attack - Ranged']
  conditions = [
    new NameDescription('Blinded', ''),
    new NameDescription('Confused', ''),
    new NameDescription('Cowering', ''),
    new NameDescription('Dazed', ''),
    new NameDescription('Dazzled', ''),
    new NameDescription('Dead', ''),
    new NameDescription('Deafened', ''),
    new NameDescription('Disabled', ''),
    new NameDescription('Dying', ''),
    new NameDescription('Entangled', ''),
    new NameDescription('Exhausted', ''),
    new NameDescription('Facinated', ''),
    new NameDescription('Fatigued', ''),
    new NameDescription('Flat-Footed', ''),
    new NameDescription('Frightened', ''),
    new NameDescription('Grappled', ''),
    new NameDescription('Helpless', ''),
    new NameDescription('Incorporeal', ''),
    new NameDescription('Invisible', ''),
    new NameDescription('Nauseated', ''),
    new NameDescription('Panicked', ''),
    new NameDescription('Paralyzed', ''),
    new NameDescription('Petrified', ''),
    new NameDescription('Pinned', ''),
    new NameDescription('Prone', ''),
    new NameDescription('Shaken', ''),
    new NameDescription('Sickened', ''),
    new NameDescription('Stable', ''),
    new NameDescription('Staggered', ''),
    new NameDescription('Stunned', ''),
    new NameDescription('Unconscious', ''),
  ]

  sizes = [
    new TokenSize("fine", "Fine (½')", 0.5, 0.5, DistanceUnit.Feet),
    new TokenSize("diminutive", "Diminutive (1')", 1, 1, DistanceUnit.Feet),
    new TokenSize("tiny", "Tiny (2½')", 2.5, 2.5, DistanceUnit.Feet),
    new TokenSize("small", "Small (5')", 5, 5, DistanceUnit.Feet),
    new TokenSize("medium", "Medium (5')", 5, 5, DistanceUnit.Feet),
    new TokenSize("large", "Large (10')", 10, 10, DistanceUnit.Feet),
    new TokenSize("huge", "Huge (15')", 15, 15, DistanceUnit.Feet),
    new TokenSize("gargantuan", "Gargantuan (20')", 20, 20, DistanceUnit.Feet),
    new TokenSize("colossal", "Colossal (30')", 30, 30, DistanceUnit.Feet),
  ]

  readonly emissionTypes: string[] = [
    "Magic",
    "Scent",
    "Invisible",
    "Incorporeal",
    "Law",
    "Chaos",
    "Evil",
    "Good",
    "Traps",
    "Hidden Doors"
  ]

  constructor() {
    super()
  }

  load(cache: CacheService) {
    this.loadMonsters(cache)
  }

  private loadMonsters(cache: CacheService) {
    // Load the Monsters
    cache.get(Pathfinder.MONSTER_PATH).subscribe(cached => {
      if (cached !== null) {
        const fromCache = <any[]>cached
        const real = fromCache.map(c => Monster.to(c))
        this.monsters$.next(real)
      }
    })
  }


  subscribeToUpdates(db: AngularFireDatabase, cache: CacheService) {
    db.object<CachedItem>(Pathfinder.MONSTER_PATH).valueChanges().subscribe(item => {
      console.log("Getting new Monster cache record", item)
      const remoteVersion = item ? item.version : -1
      const localVersion = cache.version(Pathfinder.MONSTER_PATH)
      console.log(`Comparing Versions ${remoteVersion} vs ${localVersion}`)
      if (remoteVersion !== localVersion) {
        cache.download(item).subscribe(data => {
          const fromCache = <any[]>data
          const real = fromCache.map(c => Monster.to(c))
          this.monsters$.next(real)
        })
      }
    })

  }


}