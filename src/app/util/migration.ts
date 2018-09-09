import { AngularFireDatabase } from "angularfire2/database";
import { AngularFirestore } from "angularfire2/firestore";
import { take, first } from "rxjs/operators";
import { DbConfig } from "../models/database-config";
import { Character, MapConfig, MapType, MarkerCategory, MarkerType, Annotation, MarkerGroup, User, UserAssumedAccess, CharacterType, Prefs, Restricition } from "../models";
import { LangUtil } from "./LangUtil";

export class FirebaseDataabaseMigration {
  constructor(private db: AngularFireDatabase, private defaultGameId, private gsId) { }

  migrateAll() {
    // this.migrateGames()
    // this.migrateCharacters()
    // this.migrateMonsters()
    // this.migrateMaps()
    // this.migratePerMap()
    // this.migrateAnnotations()
    // this.migrateUsers()
  }


  fixFields() {
    // Add the correct 'owner' field

    // Remove edit and view
    // Add restriction = 0
    // const ownerId = 'c4668937-0d91-85ac-8281-ec3caf50be98'
    const ownerId = 'pathfinder'
    this.db.object<any>("assets/" + ownerId ).valueChanges().pipe(first()).subscribe(item => {
      Object.keys(item).forEach(key => {
        console.log("Working on ", key)
        const obj = item[key]
        Object.keys(obj).forEach(id => {
          const asset = obj[id]
          const path = DbConfig.ASSET_FOLDER + "/" + ownerId + "/" + key + "/" + asset.id
          asset.owner = ownerId
          delete asset['edit']
          delete asset['view']
          asset.restriction = Restricition.PlayerReadWrite
          console.log("PATH: " + path, asset);
          
          this.db.object(path).set(asset)
        })
      })
    })
  }

  migrateUsers() {
    console.log("migrateUsers");

    this.db.list<User>("users").valueChanges().subscribe(users => {
      console.log("USERS FOUND", users.length);

      users.forEach(u => {
        console.log("ON USER :", u);
        u.id = u['uid']
        // delete u['uid']
        const path = DbConfig.pathTo(User.TYPE, undefined, u.id)
        this.db.object(path).set(u).then(success => console.log("SUCCESS")).catch(error => console.log("ERROR", error));

      })
    })
  }

  private migrateUserPrefs(id: string) {
    console.log("migrateUserPrefs");

    this.db.list<Prefs>("user-prefs").valueChanges().subscribe(prefs => {
      console.log("PREFS FOUND", prefs.length);
      prefs.forEach(pref => {
        if (pref['uid'] == id) {
          this.migrateUserPref(pref)
        }
      })
    })
  }


  private migrateUserPref(pref: Prefs) {
    console.log("ON PREF :", DbConfig.pathTo(Prefs.TYPE, undefined, pref.id), pref);
    pref.id = pref['uid']
    // delete pref['uid']
    const path = DbConfig.pathTo(Prefs.TYPE, undefined, pref.id)
    this.db.object(path).set(pref).then(success => console.log("SUCCESS")).catch(error => console.log("ERROR", error));
  }


  migrateCharacters() {
    this.migrate("characters", Character.TYPE, this.defaultGameId)
    this.migrate("character-types", CharacterType.TYPE, this.defaultGameId)
  }

  migrateMonsters() {
  
  }

  migrateMaps() {
    this.migrate("maps", MapConfig.TYPE, this.defaultGameId)
    this.migrate("mapTypes", MapType.TYPE, this.defaultGameId)
    this.migrate("markerCategories", MarkerCategory.TYPE, this.defaultGameId)
    this.migrate("markerTypes", MarkerType.TYPE, this.defaultGameId)
  }

  migrateAnnotations() {
    this.db.list<MapConfig>("maps").valueChanges().subscribe(maps => {
      maps.forEach(map => {
        const path = "annotations/" + map.id

        this.db.list<any>(path).valueChanges().pipe(
          take(1),
        ).subscribe(items => {
          items.forEach(item => {
            const path = DbConfig.pathTo(Annotation.TYPE, this.defaultGameId, item.id)
            // let points = item.points
            // let newPoints = LangUtil.array2Map(points)
            // console.log("Converted Points to a Map:", points, newPoints);

            // item.points = newPoints
            console.log("PATH " + path, item);
            this.db.object(path).set(item).then(success => {
              console.log("SUCCESS " + Annotation.TYPE);
            }).catch(error => {
              console.log("ERROR " + Annotation.TYPE, error, item);
            })
          })
        })

      })
    })
  }

  migratePerMap() {
    this.db.list<MapConfig>("maps").valueChanges().subscribe(maps => {
      maps.forEach(map => {
        const path = "markerGroups/" + map.id
        this.migrate(path, MarkerGroup.TYPE, this.defaultGameId)
      })
    })
  }


  private migrate(oldpath: string, type: string, parentId) {
    console.log("MIGRATING " + oldpath, type, parentId);

    this.db.list<any>(oldpath).valueChanges().pipe(
      take(1),
    ).subscribe(items => {
      items.forEach(item => {
        const path = DbConfig.pathTo(type, parentId, item.id)
        console.log("PATH " + path, item);
        this.db.object(path).set(item).then(success => {
          console.log("SUCCESS " + type);
        }).catch(error => {
          console.log("ERROR " + type, error);
        })
      })
    })
  }


}



export class FirestoreMigration {
  constructor(private oldDb: AngularFireDatabase, private db: AngularFirestore, private defaultGameId, private gsId) { }

  migrateAll() {
    this.deleteAll()
    this.migrateGames()
    this.migrateCharacters()
    this.migrateMonsters()
    this.migrateMaps()
    this.migratePerMap()
    this.migrateAnnotations()
    this.migrateUsers()

    // m.migrateGames()
    // m.migrateMonsters()
    // m.migrateMaps()
    // m.migratePerMap()
    // m.migrateUsers()
    // m.migrateUserPrefs()
    // m.migrateUserPrefs()
    // m.migrateAnnotations
  }

  deleteAll() {

  }

  migrateUsers() {
    console.log("migrateUsers");

    this.oldDb.list<User>("users").valueChanges().subscribe(users => {
      console.log("USERS FOUND", users.length);

      users.forEach(u => {
        console.log("ON USER :", u);
        u.id = u['uid']
        delete u['uid']
        const path = DbConfig.pathTo(User.TYPE, undefined, u.id)
        this.db.doc(path).set(u).then(success => console.log("SUCCESS")).catch(error => console.log("ERROR", error));

      })
    })
  }

  private migrateUserPrefs(id: string) {
    console.log("migrateUserPrefs");

    this.oldDb.list<Prefs>("user-prefs").valueChanges().subscribe(prefs => {
      console.log("PREFS FOUND", prefs.length);
      prefs.forEach(pref => {
        if (pref['uid'] == id) {
          this.migrateUserPref(pref)
        }
      })
    })
  }


  private migrateUserPref(pref: Prefs) {
    console.log("ON PREF :", DbConfig.pathTo(Prefs.TYPE, undefined, pref.id), pref);
    pref.id = pref['uid']
    delete pref['uid']
    const path = DbConfig.pathTo(Prefs.TYPE, undefined, pref.id)
    this.db.doc(path).set(pref).then(success => console.log("SUCCESS")).catch(error => console.log("ERROR", error));
  }

  migrateGames() {
    // Create the collection

    // Copy all the games
    this.oldDb.list("games").valueChanges().pipe(
      take(1),
    ).subscribe(games => {
      games.forEach(game => {
        const path = DbConfig.dbPath(game)
        console.log("Adding game to GAMES", game, path);
        this.db.doc(path).set(game).then(success => {
          console.log("SUCCESS");
        }).catch(error => {
          console.log("ERROR", error);
        })
      })
    })
  }

  migrateCharacters() {
    this.migrate("characters", Character.TYPE, this.defaultGameId)
    this.migrate("character-types", CharacterType.TYPE, this.defaultGameId)
  }

  migrateMonsters() {
  }

  migrateMaps() {
    this.migrate("maps", MapConfig.TYPE, this.defaultGameId)
    this.migrate("mapTypes", MapType.TYPE, this.defaultGameId)
    this.migrate("markerCategories", MarkerCategory.TYPE, this.defaultGameId)
    this.migrate("markerTypes", MarkerType.TYPE, this.defaultGameId)
  }

  migrateAnnotations() {
    this.oldDb.list<MapConfig>("maps").valueChanges().subscribe(maps => {
      maps.forEach(map => {
        const path = "annotations/" + map.id

        this.oldDb.list<any>(path).valueChanges().pipe(
          take(1),
        ).subscribe(items => {
          items.forEach(item => {
            const path = DbConfig.pathTo(Annotation.TYPE, this.defaultGameId, item.id)
            let points = item.points
            let newPoints = LangUtil.array2Map(points)
            console.log("Converted Points to a Map:", points, newPoints);

            item.points = newPoints
            console.log("PATH " + path, item);
            this.db.doc(path).set(item).then(success => {
              console.log("SUCCESS " + Annotation.TYPE);
            }).catch(error => {
              console.log("ERROR " + Annotation.TYPE, error, item);
            })
          })
        })

      })
    })
  }

  migratePerMap() {



    this.oldDb.list<MapConfig>("maps").valueChanges().subscribe(maps => {
      maps.forEach(map => {
        const path = "markerGroups/" + map.id
        this.migrate(path, MarkerGroup.TYPE, this.defaultGameId)
      })
    })

  }


  private migrate(oldpath: string, type: string, parentId) {
    console.log("MIGRATING " + oldpath, type, parentId);

    this.oldDb.list<any>(oldpath).valueChanges().pipe(
      take(1),
    ).subscribe(items => {
      items.forEach(item => {
        const path = DbConfig.pathTo(type, parentId, item.id)
        console.log("PATH " + path, item);
        this.db.doc(path).set(item).then(success => {
          console.log("SUCCESS " + type);
        }).catch(error => {
          console.log("ERROR " + type, error);
        })
      })
    })
  }

}