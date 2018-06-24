import { Component, OnInit, NgZone } from '@angular/core';
import { latLngBounds, Layer, imageOverlay, CRS, Map as LeafletMap, LayerGroup, layerGroup, LeafletEvent, Marker, DomUtil } from 'leaflet';
import { AngularFireAuth } from 'angularfire2/auth';
import { MarkerService, MyMarker } from '../marker.service';
import { MapService } from '../map.service';
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
export class MapComponent implements OnInit {
  mapCfg: MapConfig
  map: LeafletMap

  user: User
  title = 'Six Kingdoms';
  bounds = latLngBounds([[0, 0], [1536, 2048]]);
  layers: Layer[] = [];
  markerLayer: LayerGroup = layerGroup()
  newmarkerLayer: LayerGroup = layerGroup()
  savedMarkers: MyMarker[] = []
  currentSelection: Selection = new Selection([])

  constructor(private zone: NgZone, private afAuth: AngularFireAuth,
    private markers: MarkerService,
    private mapSvc: MapService, private data: DataService) {

    this.markerLayer["__name"] = "All"
    this.newmarkerLayer["__name"] = "Pending Saves"

    this.data.user.subscribe(u => {
      this.user = u
    })

    this.mapSvc.mapConfig.pipe(
      mergeMap((m: MapConfig) => {
        this.mapCfg = m
        return this.data.url(m)
      })
    ).subscribe(url => {
      console.log("Download url " + url);

      let bounds = latLngBounds([[0, 0], [this.mapCfg.height, this.mapCfg.width]]);
      let mapLayer = imageOverlay(url, bounds)
      this.layers.splice(0, this.layers.length)
      this.layers.push(mapLayer)
      this.layers.push(this.markerLayer)
      this.layers.push(this.newmarkerLayer)
      this.mapSvc.fit(bounds)
    })

    this.markers.markers.subscribe(m => {
      this.savedMarkers = m
      this.refresh(m)
    })
    this.layers.push(this.l1)

    this.mapSvc.layers = this.layers
    this.mapSvc.newmarkerLayer = this.newmarkerLayer

    this.mapSvc.selection.subscribe(sel => {
      let removed = sel.removed(this.currentSelection)
      let added = sel.added(this.currentSelection)
      let same = sel.same(this.currentSelection)

      console.log("Removed Items");
      console.log(removed)
      console.log("Added Items");
      console.log(added)
      console.log("Same Items");
      console.log(same)

      removed.forEach(item => {
        console.log("Removed");
        if (MyMarker.is(item)) {
          item.selected = false
          if (item.marker["_icon"]) {
            DomUtil.removeClass(item.marker["_icon"], 'iconselected')
          }
        }
      })
      added.forEach(item => {
        console.log("Added");

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

  ngOnInit() {
  }

  // l1 = tileLayer('./assets/tiles/{z}/{x}/{y}.png', { maxZoom: 3, noWrap: true })
  // l1 = imageOverlay('./assets/map2.png', this.bounds);
  l1 = imageOverlay('./assets/missing.png', this.bounds);

  options = {
    zoom: 1,
    minZoom: -2,
    // maxZoom: 3,
    continousWorld: false,
    crs: CRS.Simple
  };


  refresh(items: MyMarker[]) {
    console.log("Adding Markers: " + items.length);
    this.markerLayer.clearLayers()
    if (items.length > 0) {
      items.forEach(m => {
        m.marker.addEventListener('click', event => {
          this.zone.run(() => {
            var m = <Marker>event.target
            let marker = new MyMarker(m)
            marker.selected = true
            this.mapSvc.select(new MyMarker(m))
          });
        })
        m.marker.on('add', event => {
          this.zone.run(() => {
            this.mapSvc.markerAdded(m)
          })
        })
        m.marker.on('remove', event => {
          this.zone.run(() => {
            this.mapSvc.markerRemoved(m)
          })
        })
        // m.marker.bindTooltip(m.name)
        this.markerLayer.addLayer(m.marker)
      })
    }
  }

  onMapReady(map: LeafletMap) {
    this.map = map
    // Install plugins
    L.control.coordinates(
      { 
        decimals: 2,
        position: "bottomleft",
        labelTemplateLat:"Y: {y}",
        labelTemplateLng:"X: {x}", 
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
