import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Map } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map = new ReplaySubject<Map>()
  _map: Map

  setMap(map: Map): any {
    this.map.next(map)
    this._map = map
  }

  panTo(location: any) {
    if (this._map !== undefined) {
      this._map.panTo(location)
    }
  }

  constructor() { }
}
