import { UUID } from "angular2-uuid";
import { User as FireUser } from 'firebase';

/**
 * A user in the
 */
export class User {
    name: string
    email?: string
    uid: string
    photo?: string
    groups?: string[]
    assumedGroups?: string[]
    recentMarkers?: string[]
    recentMaps?: string[]

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
            console.log("Logged in user : " + fireUser.uid);

            u.uid = fireUser.uid
            u.name = fireUser.displayName
            u.email = fireUser.email
            u.photo = fireUser.photoURL
        } else {
            console.log("No User loged in");
        }

        return u
    }
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
}

export class SavedMarker {
    id: string
    map: string
    name: string
    description?: string
    type: string
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
    image: string  /// Calculated
    thumb: string   /// Calculated
    width: number   /// Calculated
    height: number  /// Calculated
    view: string[]
    edit: string[]
}

export class UserGroup {
    name: string
    description?: string
    members: string[]
}

export class MergedMapType {
    id: string
    name: string
    order: number
    maps: MapConfig[]
}

export class Selection {
    public static readonly MARKER = 'marker'

    constructor(public items : any[], public type?: string) {
        console.log("Created Select of " + this.items.length);
    }

    public get first() : any {
        if ( this.items &&  this.items.length > 0) {
            return this.items[0]
        }
    }

    public isEmpty() {
        return ! ( this.items &&  this.items.length > 0)
    }

    public removed(previous : Selection) : any[] {
        let found = previous.items.filter( prevItem => !this.items.includes(prevItem))
        if (found) {
            return found
        }
        return []
    }
    public added(previous : Selection) : any[] {
        let found = this.items.filter( item => !previous.items.includes(item))
        if (found) {
            return found
        }
        return []
    }
    public same(previous : Selection) : any[] {
        let found = previous.items.filter( prevItem => this.items.includes(prevItem))
        if (found) {
            return found
        }
        return []
    }
}


interface ObjType {
    objType: string
}

export class Test1 implements ObjType {
    objType: string = 'models.Test1'
    hi: string
    opt?: string

    static is(obj: any): obj is Test1 {
        return (<Test1>obj).objType !== undefined && (<Test1>obj).objType === 'models.Test1'
    }
}

export class Test2 implements ObjType {
    objType: string = 'models.Test2'

    static is(obj: any): obj is Test1 {
        return (<ObjType>obj).objType !== undefined && (<Test1>obj).objType === 'models.Test1'
    }
    static convertTo(obj: any) {
        let me = new MapType()
        Object.assign(me, obj)

        return me
    }
}

class abc {
    fun(a: any) {

        let b = {
            hi: " HIH"
        }

        if (Test1.is(a)) {
            
        }

        if (Test1.is(b)) {

        }


    }
}
