import { Component, OnInit, NgZone } from '@angular/core';
import { latLngBounds, Layer, imageOverlay, CRS, Map as LeafletMap, LayerGroup, layerGroup, LeafletEvent, Marker, DomUtil } from 'leaflet';
import { AngularFireAuth } from 'angularfire2/auth';
import { MapService, MyMarker } from '../map.service';
import { DataService } from '../data.service';
import { MapConfig, User, SavedMarker, Selection } from '../models';
import { flatten } from '@angular/compiler';
import { ReplaySubject, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import * as L from 'leaflet';
import * as simple from 'leaflet-simple-graticule';
import '../../../node_modules/leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.src.js';
import { Trans } from '../util/transformation';

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
  crs = Trans.createManualCRS(6)

  options = {
    zoom: 1,
    minZoom: -2,
    // maxZoom: 3,
    continousWorld: false,
    crs: this.crs
  };

  layers: Layer[] = [];

  currentSelection: Selection = new Selection([])

  constructor(private zone: NgZone, private afAuth: AngularFireAuth,
    private mapSvc: MapService, private data: DataService) {

    this.mapSvc.mapConfig.pipe(
      mergeMap((m: MapConfig) => {
        if (m.id != 'BAD') {
          this.mapCfg = m
          return this.data.url(m)
        } else {
          this.mapCfg = undefined
          return of("")
        }
      })
    ).subscribe(url => {
      console.log("Map Changed!", this.crs);
      if (url != "") {
        let factor = Trans.computeFactor(this.mapCfg)
        let transformation = Trans.createTransform(this.mapCfg)
        let bounds = latLngBounds([[0, 0], [this.mapCfg.height / factor, this.mapCfg.width / factor]]);
        let mapLayer = imageOverlay(url, bounds)
        this.mapSvc.overlayLayer = mapLayer
        this.crs.transformation = new L.Transformation(factor, 0, -factor, 0)
        this.map.setMaxBounds(bounds);

        this.layers.splice(0, this.layers.length)
        this.layers.push(mapLayer)
        this.layers.push(this.mapSvc.allMarkersLayer)
        this.layers.push(this.mapSvc.newMarkersLayer)
        this.mapSvc.fit(bounds)
      } else {
        this.layers.splice(0, this.layers.length)
      }
    })

    this.mapSvc.selection.subscribe(sel => {
      let removed = sel.removed(this.currentSelection)
      let added = sel.added(this.currentSelection)
      let same = sel.same(this.currentSelection)

      removed.forEach(item => {
        if (MyMarker.is(item)) {
          if (item.marker["_icon"]) {
            DomUtil.removeClass(item.marker["_icon"], 'iconselected')
          }
        }
      })
      added.forEach(item => {
        if (MyMarker.is(item)) {
          if (item.marker["_icon"]) {
            DomUtil.addClass(item.marker["_icon"], 'iconselected')
          } else {
            console.log("NO ICON  : " + item.name);
          }
        }
      })
      this.currentSelection = sel
    })
  }

  onMapReady(map: LeafletMap) {
    this.map = map
    console.log("Map Ready!", map);

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
    L.control.scale().addTo(map)

    this.zone.run(() => {
      this.mapSvc.setMap(map);
    });
  }



}
