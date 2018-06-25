import { Injectable, NgZone } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Map as LeafletMap, LatLng, Layer, LayerGroup, Marker, layerGroup } from 'leaflet';
import { MapConfig, Selection, MarkerGroup, SavedMarker } from './models';
import { MyMarker, MarkerService } from './marker.service';
import { DataService } from './data.service';
import { combineLatest } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private readonly UNCATEGORIZED = "UNCATEGORIZED"
  public selection = new ReplaySubject<Selection>()
  public markerReady = new ReplaySubject<MyMarker>()
  public markerRemove = new ReplaySubject<MyMarker>()

  layers: Layer[];
  newmarkerLayer: LayerGroup;

  map = new ReplaySubject<LeafletMap>()
  _map: LeafletMap
  _mapCfg: MapConfig
  mapConfig = new ReplaySubject<MapConfig>()

  groups: MarkerGroup[] = []
  markers: SavedMarker[] = []
  myMarkers = new Map<string, MyMarker>()
  lGroups = new Map<string, LayerGroup>()

  constructor(private zone: NgZone, private data: DataService, private mks: MarkerService) {

  }

  addTempMarker(marker: MyMarker) {
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

  setConfig(mapCfg: MapConfig) {
    this.mapConfig.next(mapCfg)
    this._mapCfg = mapCfg
    this.load()
  }

  setMap(map: LeafletMap): any {
    this.map.next(map)
    this._map = map
  }

  load() {
    this.data.getMarkerGroups(this._mapCfg.id)
      .subscribe(
        groups => {
          this.groups = groups
          this.lGroups.clear()
          this.lGroups.set(this.UNCATEGORIZED, layerGroup())
          groups.forEach(g => {
            let lg = layerGroup()
            this.lGroups.set(g.id, lg)
          })
        }
      )
    this.data.getMarkers(this._mapCfg.id)
      .subscribe(
        markers => {
          this.markers = markers
        }
      )
  }

  panTo(location: any) {
    if (this._map !== undefined) {
      this._map.panTo(location)
    }
  }

  getCenter(): LatLng {
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

}
