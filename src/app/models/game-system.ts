import { ObjectType } from "./core";
import { ReplaySubject, Subscription, Observable, BehaviorSubject } from "rxjs";
import { LangUtil } from "../util/LangUtil";
import { AngularFireDatabase } from "angularfire2/database";
import { Game, AssetOwner } from "./game";

export class GameSystem extends AssetOwner {
  public static readonly TYPE = 'db.GameSystem'
  public static readonly FOLDER = 'game-systems'
  readonly objType: string = GameSystem.TYPE

  static is(obj: any): obj is GameSystem {
    return obj.objType !== undefined && obj.objType === GameSystem.TYPE
  }

  static to(obj: any): GameSystem {
    return new GameSystem().copyFrom(obj)
  }

  image?: string
  theme?: string
  supports?: string[]
  health: string
  defense: string
  commonAttributes?: string[]
  commonRolls?: string[]
}

export class PrimaryAttribute {
  attr: string
  shape: 'heart' | 'shield' | 'rectangle' | 'circle'
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