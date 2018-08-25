import { IObjectType, ObjectType } from "./core";
import { User as FireUser } from 'firebase';

/**
 * A user in the
 */
export class User extends ObjectType {
  public static readonly TYPE = 'db.User'
  public static readonly FOLDER = 'users'
  public static readonly SAMPLE = {
    objType: '',
    name: 'string',
    email: 'string',
    photo: 'string',
    groups: [],
    uid: 'string',
    maps: {},
    recentMarkers: [],
    recentMaps: [],
    assumedGroups: []
  }

  name: string
  email?: string
  id: string
  photo?: string
  groups?: string[]


  isAdmin(): boolean {
    return this.groups.includes("admin")
  }

  constructor() {
    super()
    this.name = "no one"
    this.id = "NOBODY"
  }

  static fromFireUser(fireUser: FireUser) {
    var u = new User()
    if (fireUser !== null) {
      u.id = fireUser.uid
      u.name = fireUser.displayName
      u.email = fireUser.email
      u.photo = fireUser.photoURL
    }
    return u
  }

  // TypeScript guard
  static is(obj: any): obj is User {
    return obj.objType !== undefined && obj.objType === User.TYPE
  }

  static to(obj: any): User {
    return new User().copyFrom(obj)
  }

  dbPath(): string {
    return User.FOLDER + '/' + this.id
  }

  static pathTo(userId: string): string {
    return User.FOLDER + '/' + userId
  }

  // getMapPref(mapId: string): MapPrefs {
  //   if (!this.maps) {
  //     this.maps = new Map<string, MapPrefs>()
  //   }

  //   if (!this.maps[mapId]) {
  //     let mp = new MapPrefs()
  //     mp.mapId = mapId
  //     this.maps[mapId] = new MapPrefs()
  //   }
  //   return this.maps[mapId]
  // }

  // isHiddenMarker(mapId: string, markerId: string): boolean {
  //   let mp = this.getMapPref(mapId)
  //   if (mp.hiddenMarkers) {
  //     return mp.hiddenMarkers.includes(markerId)
  //   }
  //   return false
  // }

  // isHiddenGroup(mapId: string, groupId: string): boolean {
  //   let mp = this.getMapPref(mapId)
  //   if (mp.hiddenGroups) {
  //     return mp.hiddenGroups.includes(groupId)
  //   }
  //   return false
  // }

  readonly objType: string = User.TYPE
}

export class UserAssumedAccess extends ObjectType {
  public static readonly TYPE = 'db.UserAssumedAccess'
  public static readonly FOLDER = 'user-access'

  readonly objType: string = UserAssumedAccess.TYPE

  static is(obj: any): obj is User {
    return obj.objType !== undefined && obj.objType === UserAssumedAccess.TYPE
  }

  static to(obj: any): UserAssumedAccess {
    return new UserAssumedAccess().copyFrom(obj)
  }

  id: string
  assumedGroups?: string[]

}

export class MapPrefs extends ObjectType {
  public static readonly TYPE = 'db.MapPrefs'
  public static readonly FOLDER = 'user-map-prefs'

  readonly objType: string = MapPrefs.TYPE
  id: string
  maps = {}

  static is(obj: any): obj is User {
    return obj.objType !== undefined && obj.objType === MapPrefs.TYPE
  }

  static to(obj: any): MapPrefs {
    return new MapPrefs().copyFrom(obj)
  }

  getMapPref(mapId: string): MapPref {
    if (!this.maps) {
      this.maps = new Map<string, MapPref>()
    }

    if (!this.maps[mapId]) {
      let mp = new MapPref()
      mp.mapId = mapId
      this.maps[mapId] = new MapPref()
    }
    return this.maps[mapId]
  }

  isHiddenMarker(mapId: string, markerId: string): boolean {
    let mp = this.getMapPref(mapId)
    if (mp.hiddenMarkers) {
      return mp.hiddenMarkers.includes(markerId)
    }
    return false
  }

  isHiddenGroup(mapId: string, groupId: string): boolean {
    let mp = this.getMapPref(mapId)
    if (mp.hiddenGroups) {
      return mp.hiddenGroups.includes(groupId)
    }
    return false
  }
}

export class MapPref extends ObjectType {
  public static readonly TYPE = 'db.MapPrefs'
  public static readonly FOLDER = 'user-map-prefs'

  readonly objType: string = MapPrefs.TYPE

  mapId: string
  hiddenGroups: string[] = []
  hiddenMarkers: string[] = []
}

export class Prefs extends ObjectType {
  public static readonly TYPE = 'db.UserPrefs'
  public static readonly FOLDER = 'user-prefs'
  readonly objType: string = Prefs.TYPE
  id: string
  // uid: string
  recentMarkers: string[] = []
  recentMaps: string[] = []
  showScale: boolean = true
  showCoords: boolean = false
  expandTabOnSelect: boolean = true
  use3dDice: boolean = true
  sounds: boolean = true
  savedExpressions: string[] = []
  lastChatId: string

  static is(obj: any): obj is User {
    return obj.objType !== undefined && obj.objType === Prefs.TYPE
  }

  static to(obj: any): Prefs {
    return new Prefs().copyFrom(obj)
  }
}