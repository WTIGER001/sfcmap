import { Injectable, NgZone } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Map, LatLng, Layer, LayerGroup, Marker } from 'leaflet';
import { MapConfig, Selection } from './models';
import { MyMarker } from './marker.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {
 
 
  public selection = new ReplaySubject<Selection>()
  public markerReady = new ReplaySubject<MyMarker>()
  public markerRemove = new ReplaySubject<MyMarker>()


  layers: Layer[];
  newmarkerLayer: LayerGroup;

  map = new ReplaySubject<Map>()
  _map: Map
  mapConfig = new ReplaySubject<MapConfig>()

  addTempMarker(marker : MyMarker) {
    this.newmarkerLayer.clearLayers()
    marker.marker.addTo(this.newmarkerLayer)
    marker.marker.addEventListener('click', event => {
      this.zone.run(() => {
        var m = <Marker>event.target
        let marker = new MyMarker(m)
        marker.selected = true
        this.select(new MyMarker(m))
      });
    })
  }

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

  select(...items) {
    this.selection.next(new Selection(items))
  }
  markerAdded(marker: MyMarker) {
    this.markerReady.next(marker)
  }
  markerRemoved(marker: MyMarker) {
    this.markerRemove.next(marker)
  }

  constructor(private zone : NgZone) { }
}
