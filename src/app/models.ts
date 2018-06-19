
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
    iconUrl: string /// Calculated
    shadowUrl?: string /// Calculated 
    iconSize: number[]
    shadowSize: number[]
    iconAnchor: number[]    // point of the icon which will correspond to marker's location
    shadowAnchor: number[]  // the same for the shadow
    popupAnchor: number[]
}

/**
 * A type of map. For example: World / Continent, City / Town, Building Interior, 
 */
export class MapType {
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
}