import { IObjectType } from "./core";
import { User as FireUser } from 'firebase';

/**
 * A user in the
 */
export class User implements IObjectType {
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
    uid: string
    photo?: string
    groups?: string[]

    maps = {}
    recentMarkers?: string[]
    recentMaps?: string[]
    assumedGroups?: string[]

    isAdmin(): boolean {
        return this.groups.includes("admin")
    }

    constructor() {
        this.name = "no one"
        this.uid = "NOBODY"
    }

    static fromFireUser(fireUser: FireUser) {
        var u = new User()
        if (fireUser !== null) {
            u.uid = fireUser.uid
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

    dbPath(): string {
        return User.FOLDER + '/' + this.uid
    }

    static pathTo(userId: string): string {
        return User.FOLDER + '/' + userId
    }

    getMapPref(mapId: string): MapPrefs {
        if (!this.maps) {
            this.maps = new Map<string, MapPrefs>()
        }

        if (!this.maps[mapId]) {
            let mp = new MapPrefs()
            mp.mapId = mapId
            this.maps[mapId] = new MapPrefs()
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

    readonly objType: string = User.TYPE
}

export class MapPrefs {
    mapId: string
    hiddenGroups: string[] = []
    hiddenMarkers: string[] = []
}