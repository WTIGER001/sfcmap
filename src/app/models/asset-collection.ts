import { ReplaySubject, combineLatest, Observable, merge, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AngularFirestore } from "angularfire2/firestore";
import { DbConfig } from "./database-config";

export class AssetCollection<T> {
  items$ = new ReplaySubject<T[]>(1)
  pathTo: (ownerId, itemId) => string
  sources: AssetLink[] = []
  excludeIds: string[] = []
  sub: Subscription

  constructor(private objType: string) {
    // this.pathTo = DbConfig.pathToFn(objType)
  }

  subscribe(db: AngularFirestore) {
    const subs = []
    this.sources.forEach(src => {
      subs.push(...src.values.map(v => this.subscribeToLink(src.field, v, src.owner, db, this.pathTo)))
    })

    this.sub = combineLatest(subs).subscribe(results => {
      let all = []
      results.forEach(r => {
        all.push(...r)
      })
      if (this.excludeIds && this.excludeIds.length > 0) {
        all = all.filter(item => this.excludeIds.includes(item.id))
      }
      this.items$.next(all)
    })
  }

  subscribeToLink(field: string, value: string, owner: string, db: AngularFirestore, pathTo: (ownerId, itemId) => string): Observable<T[]> {
    const path = pathTo(owner, undefined)
    return db.collection<T>(path, ref => ref.where(field, '==', value)).valueChanges().pipe(
      map(items => items.map(item => DbConfig.toItem(item)))
    )
  }

  unsubscribe() {
    this.sub.unsubscribe()
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