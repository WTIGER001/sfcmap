

/*
  Shared Events
     - Change Map
     - Zoom Map
     - Pan Map
     - Select item
*/


export class ShareEvent {
  browserId : string
  userId : string
  data : any
}

export class MapShareData {
  mapId : string
  zoom: number
  lat: number
  lng: number
}