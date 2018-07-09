import { UUID } from "angular2-uuid";
import { User as FireUser } from 'firebase';

/**
 * A user in the
 */
export class User {
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

    static dbPath(obj: User): string {
        return User.FOLDER + '/' + obj.uid
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



/** 
 * A Marker Category is a group that markers are placed into. 
*/
export class MarkerCategory {
    id: string
    name: string
    icon?: string
    appliesTo: string[]
}

export enum AnchorPostitionChoice {
    TopLeft = 0,
    TopCenter,
    TopRight,
    MiddleLeft,
    MiddleCenter,
    MiddleRight,
    BottomLeft,
    BottomCenter,
    BottomRight
}

/**
 * A Marker Type is a type of marker that can be placed. This type brings with it the icon and category
 */
export class MarkerType {
    id: string
    name: string
    category: string
    iconSize: [number, number]
    iconAnchor: [number, number]    // point of the icon which will correspond to marker's location
    url?: string
    zoomLevelForOriginalSize: number = 1
    zoomRange: [number, number] = [-20, 200]
    displayRange: [number, number] = [-20, 200]
    sizing: string = 'fixed'
    anchorPosition: AnchorPostitionChoice = AnchorPostitionChoice.MiddleCenter
}

export class SavedMarker {
    public static readonly TYPE = 'db.markers'
    public static readonly SAMPLE = new SavedMarker()

    // TypeScript guard
    static is(obj: any): obj is SavedMarker {
        return obj.objType !== undefined && obj.objType === SavedMarker.TYPE
    }

    readonly objType: string = SavedMarker.TYPE
    id: string
    map: string
    name: string
    description?: string
    type: string
    markerGroup: string
    mapLink: string
    location: [number, number]
    view: string[]
    edit: string[]
}


/**
 * A type of map. For example: World / Continent, City / Town, Building Interior, 
 */
export class MapType {
    id: string
    name: string
    order: number
    defaultMarker?: string
}

/**
 * A configuration for a map.
 */
export class MapConfig {
    id: string
    mapType: string
    name: string
    description?: string
    defaultMarker?: string
    ppm: number
    image: string  /// Calculated
    thumb: string   /// Calculated
    width: number   /// Calculated
    height: number  /// Calculated
    view: string[]
    edit: string[]
}

export class UserGroup implements IObjectType {
    public static readonly TYPE = 'db.UserGroup'
    public static readonly SAMPLE = new UserGroup()

    // TypeScript guard
    static is(obj: any): obj is UserGroup {
        return obj.objType !== undefined && obj.objType === UserGroup.TYPE
    }

    readonly objType: string = UserGroup.TYPE
    name: string
    description?: string
    members: string[]
}

export class MergedMapType {
    id: string
    name: string
    order: number
    defaultMarker: string
    maps: MapConfig[]
}

export interface IObjectType {
    objType: string
}

export interface IDbItem {
    id: string
    name: string
    description: string
}

export interface IRestrictedItem {
    edit: string[]
    view: string[]
}

export class MarkerGroup implements IRestrictedItem, IDbItem, IObjectType {
    public static readonly TYPE = 'db.MarkerGroup'
    public static readonly FOLDER = 'markerGroups'
    public static readonly SAMPLE = {
        objType: '',
        id: 'string',
        name: 'string',
        description: 'string',
        map: 'string',
        edit: [],
        view: [],
    }

    // TypeScript guard
    static is(obj: any): obj is MarkerGroup {
        return obj.objType !== undefined && obj.objType === MarkerGroup.TYPE
    }

    static dbPath(obj: MarkerGroup): string {
        return MarkerGroup.FOLDER + '/' + obj.map + "/" + obj.id
    }

    readonly objType: string = MarkerGroup.TYPE
    id: string
    name: string
    description: string
    map: string
    edit: string[]
    view: string[]
    markers: SavedMarker[]
}

export class Selection {

    public static readonly MARKER = 'marker'

    constructor(public items: any[], public type?: string) {
        console.log("Created Select of " + this.items.length);
    }

    public get first(): any {
        if (this.items && this.items.length > 0) {
            return this.items[0]
        }
    }

    toggle(...objs): Selection {
        let myItems = this.items.slice(0)
        objs.forEach(item => {
            console.log("Looking at ", item.name);

            if (myItems.includes[item]) {
                let i = myItems.indexOf(item)
                myItems = myItems.splice(i, 1)
            } else {
                myItems.push(item)
            }
        })

        myItems.forEach(i => {
            console.log("In selection ", i.name);
        })

        return new Selection([])
    }

    public isEmpty() {
        return !(this.items && this.items.length > 0)
    }

    public removed(previous: Selection): any[] {
        let found = previous.items.filter(prevItem => !this.items.includes(prevItem))
        if (found) {
            return found
        }
        return []
    }
    public added(previous: Selection): any[] {
        let found = this.items.filter(item => !previous.items.includes(item))
        if (found) {
            return found
        }
        return []
    }
    public same(previous: Selection): any[] {
        let found = previous.items.filter(prevItem => this.items.includes(prevItem))
        if (found) {
            return found
        }
        return []
    }
}


export class MapPrefs {
    mapId: string
    hiddenGroups: string[] = []
    hiddenMarkers: string[] = []
}

export class Category {
    appliesTo: string[];
    name: string
    id: string
    types: MarkerType[] = []
}

export class Distance {
    constructor(public value: number, public unit: string) {
    }
}



