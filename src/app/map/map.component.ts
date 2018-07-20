import { Component, OnInit, NgZone } from '@angular/core';
import { latLngBounds, Layer, imageOverlay, CRS, Map as LeafletMap, LayerGroup, layerGroup, LeafletEvent, Marker, DomUtil } from 'leaflet';
import { AngularFireAuth } from 'angularfire2/auth';
import { MapService } from '../map.service';
import { DataService } from '../data.service';
import { MapConfig, User, Selection, Annotation } from '../models';
import { ReplaySubject, of } from 'rxjs';
import { mergeMap, delay } from 'rxjs/operators';
import * as L from 'leaflet';
import '../../../node_modules/leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.src.js';
// import '../../../node_modules/leaflet-editable/src/Leaflet.Editable.js';
import '../leaflet/edit.js';
import '../../../node_modules/leaflet.path.drag/src/Path.Drag.js';
import { Trans } from '../util/transformation';
import { Scale } from '../leaflet/scale';
import { UrlResolver } from '@angular/compiler';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  mapCfg: MapConfig
  map: LeafletMap

  bounds = latLngBounds([[0, 0], [1536, 2048]]);
  mainMap = imageOverlay('https://firebasestorage.googleapis.com/v0/b/sfcmap.appspot.com/o/images%2Ff1d8f636-6e8e-bde6-15b0-af7f81571c12?alt=media&token=582b3c4c-f8d5-44bd-a211-f3c609f0b23a', this.bounds);
  crs = Trans.createManualCRS(6)

  user: User
  coords: L.Control
  scale: Scale

  options = {
    zoom: 1,
    minZoom: -2,
    continousWorld: false,
    crs: this.crs,
    attributionControl: false,
    zoomDelta: 0.5,
    editable: true,
    divisions: 4,
  };

  layers: Layer[] = [this.mainMap];

  currentSelection: Selection = new Selection([])

  constructor(private zone: NgZone, private afAuth: AngularFireAuth,
    private mapSvc: MapService, private data: DataService) {

    this.data.user.subscribe(u => {
      this.user = u
      this.applyPrefs()
    })

    this.mapSvc.mapConfig.subscribe(m => {
      this.mapCfg = m
      console.log("Map Changed!", this.crs);
      if (m.id != "BAD") {
        let factor = Trans.computeFactor(m)
        let transformation = Trans.createTransform(m)
        let bounds = latLngBounds([[0, 0], [m.height / factor, m.width / factor]]);

        let mapLayer = imageOverlay(m.image, bounds)
        mapLayer['title'] = "Base Map"
        this.mapSvc.overlayLayer = mapLayer
        this.crs.transformation = new L.Transformation(factor, 0, -factor, 0)
        this.map.setMaxBounds(bounds);

        this.layers.splice(0, this.layers.length)
        this.layers.push(mapLayer)
        this.layers.push(this.mapSvc.allMarkersLayer)
        this.layers.push(this.mapSvc.newMarkersLayer)

        this.mapSvc.fit(bounds)

        this.map.editTools.editLayer['title'] = "EDIT LAYER"
        this.map.editTools.featuresLayer['title'] = "FEATURES LAYER"
      } else {
        this.layers.splice(0, this.layers.length)
      }
    })

    this.mapSvc.selection.subscribe(sel => {
      let removed = sel.removed(this.currentSelection)
      let added = sel.added(this.currentSelection)
      let same = sel.same(this.currentSelection)

      removed.forEach(item => {
        if (Annotation.is(item)) {
          if (item.getAttachment()["_icon"]) {
            DomUtil.removeClass(item.getAttachment()["_icon"], 'iconselected')
          }
        }
      })
      added.forEach(item => {
        if (Annotation.is(item)) {
          if (item.getAttachment()["_icon"]) {
            DomUtil.addClass(item.getAttachment()["_icon"], 'iconselected')
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

    this.scale = new Scale()

    // Install plugins
    this.coords = L.control.coordinates(
      {
        decimals: 2,
        position: "bottomleft",
        labelTemplateLat: "Y: {y}",
        labelTemplateLng: "X: {x}",
        enableUserInput: false
      }
    )
    // L.control.scale().addTo(map)

    this.applyPrefs()

    this.zone.run(() => {
      this.mapSvc.setMap(map);
    });
  }



  applyPrefs() {
    if (this.user.prefs && this.scale) {
      this.user.prefs.showScale ? this.scale.addTo(this.map) : this.scale.remove()
      this.user.prefs.showCoords ? this.coords.addTo(this.map) : this.coords.remove()
    }
  }



}
