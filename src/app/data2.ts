import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";
import { Game, User, GameSystem, MapConfig, Character, MapType, CharacterType, Prefs, MapPrefs, UserAssumedAccess, Online, UserGroup, MarkerType, MarkerCategory, MergedMapType, Category, Restricition } from "./models";
import { ReplaySubject, BehaviorSubject, Subject, of, Subscription } from "rxjs";
import { DbConfig } from "./models/database-config";
import { tap, mergeMap } from "rxjs/operators";
import { Encounter } from "./encounter/model/encounter";
import { DataService } from "./data.service";
import { AngularFireStorage } from "angularfire2/storage";
import { NotifyService, Debugger } from "./notify.service";
import { AngularFireAuth } from "angularfire2/auth";
import { MonsterIndex } from "./models/monsterdb";
import { LangUtil } from "./util/LangUtil";

export class Data2 {
  /**
   * The logger that is used for items relating to data loading
   */
  private log: Debugger


  /** Logged In User */
  user = new BehaviorSubject<User>(DataService.NOBODY)
  userPrefs = new BehaviorSubject<Prefs>(new Prefs())
  userMapPrefs = new BehaviorSubject<MapPrefs>(new MapPrefs())
  userAccess = new BehaviorSubject<UserAssumedAccess>(new UserAssumedAccess())

  /** Top Level Collections */
  online = new ReplaySubject<Array<Online>>(1)
  users = new ReplaySubject<Array<Game>>(1)
  games = new ReplaySubject<Array<Game>>(1)
  gamesystems = new ReplaySubject<Array<GameSystem>>(1)
  groups = new ReplaySubject<Array<UserGroup>>(1)

  /** Game System Resources */
  gamesystem = new ReplaySubject<GameSystem>(1)
  monsters = new BehaviorSubject<Array<MonsterIndex>>([])

  /** Game Resources */
  game = new ReplaySubject<Game>(1)
  maps = new ReplaySubject<Array<GameSystem>>(1)
  mapTypes = new ReplaySubject<Array<MapType>>(1)
  markerCategories = new ReplaySubject<Array<MarkerCategory>>(1)
  markerTypes = new ReplaySubject<Array<MarkerType>>(1)
  mapTypesWithMaps = new ReplaySubject<Array<MergedMapType>>(1)
  categories = new ReplaySubject<Array<Category>>(1)
  characters = new ReplaySubject<Array<Character>>(1)
  characterTypes = new ReplaySubject<Array<CharacterType>>(1)
  encounters = new ReplaySubject<Array<Encounter>>(1)

  /** User Actions */
  saves = new Subject<any>()

  subs: Subscription[] = []

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private notify: NotifyService, private storage: AngularFireStorage) {
    // Load the User
  }

  public setupGameSubscriptions() {
    this.game.subscribe(g => {
      this.loadGameResources(g)
    })
  }

  /**
   * Loads and sets the current game. 
   * 
   * @param id Game ID to load
   */
  public setCurrentGame(id: string) {
    const doc = this.db.doc<Game>(DbConfig.dbPath(Game.FOLDER + '/' + id))
    const game$ = doc.valueChanges().subscribe(g => this.game.next(g))
  }

  /**
   * Loads and sets the current game system
   * 
   * @param id Gamesystem id
   */
  public setCurrentGameSystem(id: string) {
    const doc = this.db.doc<GameSystem>(DbConfig.dbPath(GameSystem.FOLDER + '/' + id))
    const game$ = doc.valueChanges().subscribe(g => this.game.next(g))
  }



  private loadGamesystems() {
    this.db.collection<GameSystem>(GameSystem.FOLDER).valueChanges().subscribe(gs => {
      const available = gs.filter(g => this.canView(this.gamesystems))
      this.gamesystems.next(available)
    })
  }

  private loadGameResources(game: Game) {
    const docPath = DbConfig.dbPath(game)
    const doc = this.db.doc<Game>(docPath)

    const maps$ = doc.collection<MapConfig>(MapConfig.FOLDER).valueChanges()
    const chrs$ = doc.collection<MapConfig>(Character.FOLDER).valueChanges()
    const encouters$ = doc.collection<MapConfig>(Encounter.FOLDER).valueChanges()
    const mapTypes$ = doc.collection<MapType>(MapType.FOLDER).valueChanges()
    const chrTypes$ = doc.collection<CharacterType>(CharacterType.FOLDER).valueChanges()
    const tags$ = doc.collection<string>('tags').valueChanges()
  }

  private loadGameResource<T>(gameDoc: AngularFirestoreDocument, subject: Subject<Array<T>>, folder: string, errorType: string, current?: Array<T>, loading?: BehaviorSubject<boolean>) {
    let sub = this.game.pipe(
      mergeMap(game => game.id === 'NOBODY' ? of([]) : gameDoc.collection<T>(name).valueChanges())
    ).subscribe(
      inTypes => {
        this.log.debug('loadGameResource ' + name)
        let items = new Array<T>()
        inTypes.forEach(item => {
          try {
            // Convert the item to a real object with methods and all
            // If something is setup incorrectly then there can be an error
            items.push(DbConfig.toItem(item))
          } catch (err) {
            this.log.error("Error Loading ", name, err)
          }
        })
        this.log.debug("Loaded " + items.length + " " + name);

        if (current) {
          current.splice(0)
          current.push(...items)
        }

        if (loading) {
          loading.next(false)
        }

        subject.next(items)
      },
      error => {
        this.notify.showError(error, errorType)
      }
    )
    this.subs.push(sub)
  }

  private loadGames() {
    let sub = this.user.pipe(
      mergeMap(u => u.uid === 'NOBODY' ? of([]) : this.db.collection<Game>('games', ref => ref.where('players', 'array-contains', u.uid)).valueChanges()),
      tap(games => this.games.next(games))
    ).subscribe()
  }

  // private loadGames() {
  //   this.db.collection<Game>(Game.FOLDER).valueChanges().subscribe(games => {
  //     const available = games.filter(game => this.canView(game))
  //     this.games.next(available)
  //   })
  // }

  private loadItems<T>(gameDoc: AngularFirestoreDocument, subject: Subject<Array<T>>, folder: string, errorType: string, current?: Array<T>, loading?: BehaviorSubject<boolean>) {
    let sub = this.game.pipe(
      // This query only retrieves data for what the user can see.... I am not sure if this is neccessary
      mergeMap(game => game.id === 'NOBODY' ? of([]) : gameDoc.collection<T>(name, ref => this.getConditions(ref, game)).valueChanges())
    ).subscribe(

    )

  }

  private getConditions(ref, game) {
    if (this.isGM(game)) {
      return undefined
    } else {
      return ref.where('restrictions', '<', Restricition.None)
    }
  }

  private isGM(game: Game | GameSystem): boolean {
    return false
  }

  private isPlayer(game: Game | GameSystem): boolean {
    return false
  }


  /**
    * Determines if the current user can view an item.
    * @param item The item to check
    */
  canView(item: any): any {
    if (!item['view']) {
      return true
    }
    let view: Array<string> = item['view']
    if (view.length == 0) {
      return true
    }
    // if (this.isReal) {
    return view.includes(this.user.getValue().uid) || LangUtil.arrayMatch(view, this.userAccess.getValue().assumedGroups)
    // }
    // return false
  }

}

/*
User
+-- User Preferences (sounds, views, etc)
+-- Game Preferences

Gamesystem
+--- Monsters
+--- NPCs
+--- Spells
+--- Feats
+--- etc,

Game 
+--- Characters
+--- Maps
     +--- Annotations
+--- Chat
+--- Encounters

Could have "ResourceCollection"

class ResourceCollection {
  id : string, 
  name: string, 
  descripton: string,
  parent: string
}
*/