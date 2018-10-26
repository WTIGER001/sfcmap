import { ReplaySubject, Observable, Subscription, of, combineLatest, merge } from "rxjs";
import { mergeMap, map, tap, filter } from "rxjs/operators";
import { FirebaseDatabase } from "angularfire2";
import { AngularFireDatabase } from "angularfire2/database";
import { Game, AssetLink, MapConfig } from "./models";
import { NotifyService, Debugger } from "./notify.service";
import { DbConfig } from "./models/database-config";
import { DataService } from "./data.service";
import { FogOfWar } from "./maps/fow";

export interface IDataAsset<T> {
  subscribe(game$: Observable<Game>, notify: NotifyService, data: DataService)
  listen(game: Game, data: DataService)
}


/**
 * Map Assets are stored under the pattern
 * /assets/<gameid>/mapassets/<type>__<mapid>
 * 
 */
export class MapAsset<T> {
  private log: Debugger
  item$ = new ReplaySubject<T>(1)
  current: T
  game: Game
  private sub: Subscription

  constructor(private type: string) {

  }

  subscribe(mapCfg$: Observable<MapConfig>, notify: NotifyService, data: DataService) {
    mapCfg$.subscribe(mapcfg => {
      this.cancelOld()
      this.listen(mapcfg, data)
    })
    return this
  }
  cancelOld() {
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }
  listen(mapcfg: MapConfig, data: DataService) {
    if (!mapcfg) {
      return
    }

    const db = data.db
    const path = DbConfig.pathTo(this.type, mapcfg.owner, mapcfg.id)
    console.log ("Listening for Map Asset at Path", path)

    this.sub = db.object<T>(path).valueChanges().pipe(
      filter(item => item !== null && item !== undefined),
      tap(item => console.log("Map Asset Received", item)),
      map(item => DbConfig.toItem(item)),
      tap(item => console.log("Map Asset CONVERTED", item)),
      tap(item => this.current = item),
      tap(item => data.record(this.type, 1)),
      tap(item => this.item$.next(item))
    ).subscribe( item => {
      // const i = FogOfWar.to(item)
      // this.current = <T><unknown>i
      // this.item$.next(this.current)
    })

  }

  pathTo(mapcfg: MapConfig): string {
    return DbConfig.pathTo(this.type, mapcfg.owner, mapcfg.id)
  }
}

export class DataAsset<T> {
  private log: Debugger
  item$ = new ReplaySubject<T>(1)
  current : T
  game: Game
  private sub: Subscription

  constructor(private type: string) {

  }

  subscribe(game$: Observable<Game>, notify: NotifyService, data: DataService) {
    game$.subscribe(game => {
      this.cancelOld()
      this.listen(game, data)
    })
  }
  cancelOld() {
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }
  listen(game : Game, data : DataService){ 
    if (!game) {
      return
    }

    const db = data.db
    const path = this.pathTo(game)

    this.sub = db.object<T>(path).valueChanges().pipe(
      filter(item => item !== null && item !== undefined),
      map( item => DbConfig.toItem(item)),
      tap( item => this.current = item),
      tap( item => data.record(this.type, 1)),
      tap( item => this.item$.next(item))
    ).subscribe()

  }

  pathTo(game: Game): string {
    return game ? this.pathToOwner(game.id) : 'NONE'
  }

  pathToOwner(id: string): string {
    return DbConfig.pathFolderTo(this.type, id)
  }

}


export class DataAssetArray<T> {

  private log: Debugger

  // Items that have been loaded
  items$ = new ReplaySubject<T[]>(1)

  // Loading Indicator
  loading = new ReplaySubject<boolean>(1)
  game: Game
  currentItems = []

  excludeIds: string[] = []

  private sub: Subscription

  constructor(private type: string) {

  }

  subscribe(game$: Observable<Game>, notify: NotifyService, data: DataService) {
    game$.subscribe(game => {
      // console.log(this.type + " --> ASSETS - NEW GAME", game);
      this.cancelOld()
      this.listen(game, data)
    })
  }

  cancelOld() {
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }

  listen(game: Game, data: DataService) {
    if (!game) {
      // console.log(this.type + " --> ASSETS - NOT Listening");
      return
    }
    // console.log(this.type + " --> ASSETS - Listening");

    // Build the observable array
    const obs$ = this.buildObs$(game, data)
    

    // Combine all of them together
    this.sub = combineLatest(obs$).subscribe(results => {
      console.log(this.type + " --> ASSETS -- RECIEVED", results.length);

      let all = []
      results.forEach(r => {
        all.push(...r)
      })
      // console.log(this.type + " --> ASSETS -- PRE Exclude", all.length);
      this.currentItems = all
      data.record(this.type, all.length)

      this.refilter()
    })
  }


  buildObs$(game: Game, data: DataService): Observable<T[]>[] {
    // console.log(this.type + " --> ASSETS - Building OBS");

    const obs$: Observable<T[]>[] = []
    let gLinks = []
    if (game.assetLinks) {
      gLinks = game.assetLinks[DbConfig.safeTypeName(this.type)] ? game.assetLinks[DbConfig.safeTypeName(this.type)] : []
    }
    const links: AssetLink[] = [this.createLinkForGame(game), ...gLinks]
    links.forEach(src => {
      if (src.field == '__ALL__') {
        obs$.push(this.subscribeToLink(src.field, undefined, src.owner, data.db))
      } else {
        obs$.push(...src.values.map(v => this.subscribeToLink(src.field, v, src.owner, data.db)))
      }
    })

    // console.log(this.type + " --> ASSETS - BUILT OBS", obs$.length);

    return obs$
  }

  refilter(): any {
    let all = this.currentItems.slice(0)
    if (this.excludeIds && this.excludeIds.length > 0) {
      all = all.filter(item => this.excludeIds.includes(item.id))
    }
    // console.log(this.type + " --> ASSETS -- ALL", all.length);
    this.items$.next(all)
  }

  createLinkForGame(game: Game) {
    const gameLink = new AssetLink();
    gameLink.field = '__ALL__'
    gameLink.ownerType = 'game'
    gameLink.owner = game.id
    return gameLink
  }

  pathTo(game: Game): string {
    return game ? this.pathToOwner(game.id) : 'NONE'
  }

  pathToOwner(id: string): string {
    return DbConfig.pathFolderTo(this.type, id)
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
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }

  subscribeToLink(field: string, value: string, owner: string, db: AngularFireDatabase): Observable<T[]> {
    const path = this.pathToOwner(owner)
    if (field == '__ALL__') {
      // console.log(this.type + " --> ASSETS - SubscribeToLink - ALL FIELDS", owner);
      return db.list<T>(path).valueChanges().pipe(
        map(items => items.map(item => DbConfig.toItem(item)))
      )
    } else {
      // console.log(this.type + " --> ASSETS - SubscribeToLink -", owner, field, value);
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