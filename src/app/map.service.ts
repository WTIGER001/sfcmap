import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Map, LatLng } from 'leaflet';
import { MapConfig } from './models';

@Injectable({
  providedIn: 'root'
})
export class MapService {
 
  map = new ReplaySubject<Map>()
  _map: Map
  mapConfig = new ReplaySubject<MapConfig>()

  setConfig(mapCfg : MapConfig) {
    this.mapConfig.next(mapCfg)
  }

  setMap(map: Map): any {
    this.map.next(map)
    this._map = map
  }

  panTo(location: any) {
    if (this._map !== undefined) {
      this._map.panTo(location)
    }
  }

  getCenter() : LatLng {
    if (this._map !== undefined) {
      return this._map.getCenter()
    }
  }
  fit(bounds): any {
    if (this._map !== undefined) {
      return this._map.fitBounds(bounds)
    }
  }


  constructor() { }
}
