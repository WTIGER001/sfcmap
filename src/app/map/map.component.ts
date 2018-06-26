import { Component, OnInit, NgZone } from '@angular/core';
import { latLngBounds, Layer, imageOverlay, CRS, Map as LeafletMap, LayerGroup, layerGroup, LeafletEvent, Marker, DomUtil } from 'leaflet';
import { AngularFireAuth } from 'angularfire2/auth';
import { MapService, MyMarker } from '../map.service';
import { DataService } from '../data.service';
import { MapConfig, User, SavedMarker, Selection } from '../models';
import { flatten } from '@angular/compiler';
import { ReplaySubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import * as L from 'leaflet';
import '../../../node_modules/leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.src.js';
import '../leaflet/box-select.js';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  mapCfg: MapConfig
  map: LeafletMap

  bounds = latLngBounds([[0, 0], [1536, 2048]]);
  mainMap = imageOverlay('./assets/missing.png', this.bounds);

  options = {
    zoom: 1,
    minZoom: -2,
    // maxZoom: 3,
    continousWorld: false,
    crs: CRS.Simple
  };

  layers: Layer[] = [];

  currentSelection: Selection = new Selection([])

  constructor(private zone: NgZone, private afAuth: AngularFireAuth,
    private mapSvc: MapService, private data: DataService) {

    this.mapSvc.mapConfig.pipe(
      mergeMap((m: MapConfig) => {
        this.mapCfg = m
        return this.data.url(m)
      })
    ).subscribe(url => {
      let bounds = latLngBounds([[0, 0], [this.mapCfg.height, this.mapCfg.width]]);
      let mapLayer = imageOverlay(url, bounds)
      this.layers.splice(0, this.layers.length)
      this.layers.push(mapLayer)
      this.layers.push(this.mapSvc.allMarkersLayer)
      this.layers.push(this.mapSvc.newMarkersLayer)
      this.mapSvc.fit(bounds)
    })

    this.mapSvc.selection.subscribe(sel => {
      let removed = sel.removed(this.currentSelection)
      let added = sel.added(this.currentSelection)
      let same = sel.same(this.currentSelection)

      removed.forEach(item => {
        if (MyMarker.is(item)) {
          item.selected = false
          if (item.marker["_icon"]) {
            DomUtil.removeClass(item.marker["_icon"], 'iconselected')
          }
        }
      })
      added.forEach(item => {
        if (MyMarker.is(item)) {
          item.selected = true
          if (item.marker["_icon"]) {
            DomUtil.addClass(item.marker["_icon"], 'iconselected')
          }
        }
      })
      this.currentSelection = sel
    })
  }

  onMapReady(map: LeafletMap) {
    this.map = map
    // Install plugins
    L.control.coordinates(
      {
        decimals: 2,
        position: "bottomleft",
        labelTemplateLat: "Y: {y}",
        labelTemplateLng: "X: {x}",
        enableUserInput: false
      }
    ).addTo(map);
    // L.Map.addInitHook
    // L.Map.addInitHook('addHandler', 'boxSelect', L.Map.BoxSelect);
    // this.map.addHandler('boxSelect', L.BoxSelect)

    this.zone.run(() => {
      this.mapSvc.setMap(map);
    });
  }

}
