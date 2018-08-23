import { Roll, Character } from "./character";
import { ObjectType } from "./core";
import { ReplaySubject, Subscription, Observable, BehaviorSubject } from "rxjs";
import { MonsterIndex } from "./monsterdb";
import { CharacterType } from "./character-type";
import { MapConfig } from "./map-config";
import { MapType } from "./map-type";
// import { Encounter } from "../encounter/model/encounter";
import { LangUtil } from "../util/LangUtil";
import { AngularFireDatabase } from "angularfire2/database";

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


  // monsters$ = new ReplaySubject<MonsterIndex[]>(1)
  // npc$ = new ReplaySubject<any[]>(1)
  // feats$ = new ReplaySubject<any[]>(1)
  // spells$ = new ReplaySubject<any[]>(1)
  // items$ = new ReplaySubject<any[]>(1)
  // characters$ = new ReplaySubject<Character[]>(1)
  // characterTypes$ = new ReplaySubject<CharacterType[]>(1)
  // maps$ = new ReplaySubject<MapConfig[]>(1)
  // mapTypes$ = new ReplaySubject<MapType[]>(1)
  // encounter$ = new ReplaySubject<Encounter[]>(1)
}

export class PrimaryAttribute {
  attr: string
  shape: 'heart' | 'shield' | 'rectangle' | 'circle'
}

export interface AssetContainer {
  id: string
  parent?: string
}


export class DataLike {
  assets: AssetContainer[] = []
  constructor(private db: AngularFireDatabase) {

  }

  asset$ = new BehaviorSubject<AssetContainer>(null)
  monsters = new AssetTracker<MonsterIndex>('Monsters', MonsterIndex.FOLDER, this.db)
  // npcs = new AssetTracker<Character>('Characters', Character.FOLDER, this.db)
  // feats = new AssetTracker<any>('Characters', Character.FOLDER, this.db)
  // spells = new AssetTracker<Character>('Characters', Character.FOLDER, this.db)
  // items = new AssetTracker<Character>('Characters', Character.FOLDER, this.db)
  characters = new AssetTracker<Character>('Characters', Character.FOLDER, this.db)
  characterTypes = new AssetTracker<CharacterType>('Character Types', CharacterType.FOLDER, this.db)
  maps = new AssetTracker<MapConfig>('Maps', MapConfig.FOLDER, this.db)
  mapType = new AssetTracker<MapType>('Map Types', MapType.FOLDER, this.db)
  encounters = new AssetTracker<Encounter>('Encounters', Encounter.FOLDER, this.db)

  focusOnAsset(id: string) {
    const ids: string[] = []
    let asset = this.getAsset(id)
    ids.push(asset.id)
    while (asset && asset.parent) {
      asset = this.getAsset(asset.parent)
      if (asset) {
        ids.push(asset.id)
      }
    }

    this.characters.setSourceIds(ids)
  }

  getAsset(id: string): AssetContainer {
    return this.assets.find(a => a.id == id)
  }

  loadAssetContainers() {
    this.db.list<AssetContainer>('asset-containers').valueChanges().subscribe(all => this.assets = all)
  }

}

export class AssetTracker<T extends ObjectType> {

  constructor(public name: string, public folder: string, private db: AngularFireDatabase) {

  }
  parentPath: string
  assetMap: Map<string, AssetSource<T>> = new Map()
  merged: Array<T>
  data$ = new ReplaySubject<Array<T>>()

  setSourceIds(ids: string[]) {
    // Remove and unsubscribe the uncessary ids
    const exists: string[] = []
    this.assetMap.forEach((v, k) => exists.push(k))
    const remove = LangUtil.arrayDiff(exists, ids)
    remove.forEach(removeId => {
      const src = this.assetMap.get(removeId)
      src.sub.unsubscribe()
      this.assetMap.delete(removeId)
    })

    ids.forEach(id => {
      if (!this.assetMap.has(id)) {
        this.subSource(id)
      }
    })
  }

  subSource(id: string) {
    const obs$ = this.getItem$(id)
    const src = new AssetSource<T>()
    src.id = id
    src.obs$ = obs$
    src.sub = obs$.subscribe(data => {
      src.data = data
      this.updateData(id)
    })
    this.assetMap.set(id, src)
  }

  getItem$(id: string): Observable<T[]> {
    const path = "asset-containers/" + id + "/" + this.folder
    return this.db.list<T>(path).valueChanges()
  }

  updateData(id: string) {
    const all = []
    this.assetMap.forEach((src, id) => {
      all.push(...src.data)
    })
    this.merged = all;
    this.data$.next(all)
  }

  dispose() {
    this.data$.complete()
    this.assetMap.forEach((src, id) => {
      src.sub.unsubscribe()
    })
  }

  /*
    Loading order:
    1.) Top Level - Load All
    2.) Next Level - Load All - Filter for ones that do not exist and filter out excluded
  */
}

export class AssetSource<T> {
  id: string
  obs$: Observable<Array<T>>
  data: T[]
  sub: Subscription
}