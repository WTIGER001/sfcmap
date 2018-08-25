import { ReplaySubject, Observable, Subscription, of, combineLatest, merge } from "rxjs";
import { mergeMap, map, tap, filter } from "rxjs/operators";
import { FirebaseDatabase } from "angularfire2";
import { AngularFireDatabase } from "angularfire2/database";
import { Game } from "./models";
import { NotifyService, Debugger } from "./notify.service";
import { DbConfig } from "./models/database-config";
import { DataService } from "./data.service";
import { AssetLink } from "./models/asset-collection";

export class DataAsset<T> {
  private log: Debugger

  // Items that have been loaded
  items$ = new ReplaySubject<T[]>(1)

  // Loading Indicator
  loading = new ReplaySubject<boolean>(1)
  game : Game
  currentItems = []

  excludeIds: string[] = []

  private sub: Subscription

  constructor(private folder: string) {

  }

  subscribe(game$: Observable<Game>, notify: NotifyService, data: DataService) {
    game$.subscribe(game => {
      this.cancelOld()
      this.listen(game, data)
    })
  }

  cancelOld() {
    this.sub.unsubscribe()
  }

  listen(game : Game, data: DataService) {
    // Build the observable array
    const obs$ = this.buildObs$(game, data)
    // Combine all of them together
    this.sub = combineLatest(obs$).subscribe(results => {
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


  buildObs$(game: Game, data: DataService) : Observable<T[]>[]  {
    const obs$ : Observable<T[]>[] = []
    const gLinks = game.assetLinks.has(this.folder) ?game.assetLinks.get(this.folder) : []
    const links : AssetLink[] = [this.createLinkForGame(game), ...gLinks]
    links.forEach(src => {
      obs$ .push(...src.values.map(v => this.subscribeToLink(src.field, v, src.owner, data.db)))
    })
    return obs$
  }

  createLinkForGame(game : Game) {
    const gameLink = new AssetLink();
    gameLink.field = '__ALL__'
    gameLink.ownerType = 'game'
    gameLink.owner =  game.id
    return gameLink
  }

  pathTo(game : Game)  : string {
    return game ? this.pathToOwner(game.id) : 'NONE'
  } 

  pathToOwner(id : string)  : string {
    return DbConfig.ASSET_FOLDER + "/" + id + "/" + this.folder 
  } 

  subscribeOld(game$: Observable<Game>, notify: NotifyService, data: DataService) {
    this.sub = game$.pipe(
      tap(ignore => this.loading.next(true)),
      map(game => this.pathTo(game)),
      mergeMap(path => path == 'NONE' ? of([]) : data.db.list<T>(path).valueChanges()),
      tap(items => this.items$.next(this.processItems(items, data))),
      tap(ignore => this.loading.next(false))
    ).subscribe(() => { }, error => {
      // RECORD ERROR
      notify.showError(error, "Error Loading Game Asset")
    })
  }

  unsubscribe() {
    this.sub.unsubscribe()
  }

  subscribeToLink(field: string, value: string, owner: string, db: AngularFireDatabase): Observable<T[]> {
    const path = this.pathToOwner(owner)
    if (field == '__ALL__') {
      return db.list<T>(path).valueChanges().pipe(
        map(items => items.map(item => DbConfig.toItem(item)))
      )
    } else {
      return db.list<T>(path, ref => ref.orderByChild(field).equalTo(value)).valueChanges().pipe(
        map(items => items.map(item => DbConfig.toItem(item)))
      )
    }
  }

  private processItems(itemsIn: T[], data: DataService): T[] {
    let items = new Array<T>()
    itemsIn.forEach(item => {
      if (data.canView(item)) {
        try {
          // Convert the item to a real object with methods and all
          // If something is setup incorrectly then there can be an error
          items.push(DbConfig.toItem(item))
        } catch (err) {
          this.log.error("Error Loading ", name, err)
        }
      }
    })
    return items
  }

}