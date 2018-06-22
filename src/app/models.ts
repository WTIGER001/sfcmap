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
    id : string
    name: string
    icon? : string
    appliesTo: string[]
}

/**
 * A Marker Type is a type of marker that can be placed. This type brings with it the icon and category
 */
export class MarkerType {
    id : string
    name: string
    category: string
    iconSize: [number, number]
    iconAnchor: [number, number]    // point of the icon which will correspond to marker's location
    url?: string
}

export class SavedMarker {
    id : string
    map : string
    name : string
    description? : string
    type : string
    location: [number, number]
    view : string[]
    edit : string[]
}


/**
 * A type of map. For example: World / Continent, City / Town, Building Interior, 
 */
export class MapType {
    id: string 
    name : string
    order: number
}

/**
 * A configuration for a map.
 */
export class MapConfig {
    id : string
    mapType : string
    name : string
    description? :string
    image : string  /// Calculated
    thumb: string   /// Calculated
    width: number   /// Calculated
    height: number  /// Calculated
    view: string[]
    edit: string[]
}

export class UserGroup {
    name : string
    description? : string
    members : string[]
}

export class MergedMapType {
    id: string 
    name : string
    order: number
    maps : MapConfig[]
}