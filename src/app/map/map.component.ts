import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { latLngBounds, Layer, imageOverlay, CRS, Map as LeafletMap, LayerGroup, layerGroup, LeafletEvent, Marker, DomUtil } from 'leaflet';
import { AngularFireAuth } from 'angularfire2/auth';
import { MapService } from '../map.service';
import { DataService } from '../data.service';
import { MapConfig, User, Selection, Annotation, MarkerTypeAnnotation, ShapeAnnotation, ImageAnnotation } from '../models';
import { ReplaySubject, of, combineLatest } from 'rxjs';
import { mergeMap, delay, debounceTime, throttleTime, tap } from 'rxjs/operators';
import * as L from 'leaflet';
import '../../../node_modules/leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.src.js';
// import '../../../node_modules/leaflet-editable/src/Leaflet.Editable.js';
import '../leaflet/edit.js';
import '../leaflet/path.js';
import '../leaflet/image-drag.js';
// import '../../../node_modules/leaflet.path.drag/src/Path.Drag.js';
import { Trans } from '../util/transformation';
import { Scale } from '../leaflet/scale';
import { UrlResolver } from '@angular/compiler';
import { ImageUtil } from '../util/ImageUtil';
import { Rect } from '../util/geom';
import { ActivatedRoute } from '@angular/router';
import { ZoomControls } from '../leaflet/zoom-controls';
import { CoordsControl } from '../leaflet/coords';
import { Ping } from '../leaflet/ping';
import { AudioService } from '../audio.service';
import { MessageService } from '../message.service';
import { ReadyState } from '@angular/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  mapCfg: MapConfig
  _map: LeafletMap
  cnt = 0

  set map(m: LeafletMap) {
    this._map = m
  }

  get map(): LeafletMap {
    return this._map
  }

  // samples need to get map 'ready' to fire
  bounds = latLngBounds([[0, 0], [50, 100]]);
  placeholder = imageOverlay('./assets/missing.png', this.bounds)
  crs = Trans.createManualCRS(1)

  dragging = true
  user: User
  coords: CoordsControl
  scale: Scale

  options = {
    zoom: 1,
    minZoom: -5,
    continousWorld: false,
    crs: this.crs,
    attributionControl: false,
    zoomDelta: 0.5,
    editable: true,
    divisions: 4,
    zoomControl: false,
    center: this.bounds.getCenter()
  };

  layers: Layer[] = [this.placeholder];

  currentSelection: Selection = new Selection([])

  constructor(private zone: NgZone, private afAuth: AngularFireAuth,
    private mapSvc: MapService, private data: DataService, private route: ActivatedRoute, private audio: AudioService, private msg: MessageService) {

    this.layers.push(this.placeholder)

    this.data.user.subscribe(u => {
      this.user = u
      this.applyPrefs()
    })

    combineLatest(this.mapSvc.map, this.mapSvc.mapConfig).subscribe(
      value => {
        let m = value[1]
        // console.log("------------------------------------------------------------------------------------------------------------");
        // console.log("Map: ", ++this.cnt);
        // console.log("------------------------------------------------------------------------------------------------------------");
        // console.log("Map Changed! -- ", m.name || 'None', " ", m.id);
        // console.log("Map: ", value[0]);
        // console.log("Map2: ", this.map);
        // console.log("CFG: ", value[1]);
        // console.log("CFG2: ", m.id);
        // console.log("THIS: ", this);
        // console.log("------------------------------------------------------------------------------------------------------------");
        const old = this.mapCfg || new MapConfig()
        let sameMap = (old.id == m.id)
        this.map['mapcfgid'] = m.id

        // Clear all the layers
        if (m.id == 'BAD' || !sameMap) {
          this.clearAllLayers()
        }

        if (m.id != "BAD") {
          this.mapCfg = m
          this._map['title'] = m.name
          let factor = Trans.computeFactor(m)
          let transformation = Trans.createTransform(m)
          let bounds = latLngBounds([[0, 0], [m.height / factor, m.width / factor]]);

          this.mapSvc.overlayLayer = imageOverlay(m.image, bounds)
          this.crs.transformation = new L.Transformation(factor, 0, -factor, 0)
          this.map.setMaxBounds(Rect.multiply(bounds, 1.25));

          this.layers.splice(0, this.layers.length)
          this.layers.push(this.mapSvc.overlayLayer, this.mapSvc.allMarkersLayer, this.mapSvc.newMarkersLayer)

          if (!sameMap || old.image != m.image) {
            this.mapSvc.fit(bounds)
          }
        } else {
          this.mapCfg = undefined
          this.layers.splice(0, this.layers.length)
        }
      })

    this.mapSvc.selection.subscribe(sel => {
      let removed = sel.removed(this.currentSelection)
      let added = sel.added(this.currentSelection)
      let same = sel.same(this.currentSelection)

      removed.forEach(item => {
        if (item.getAttachment()) {
          if (MarkerTypeAnnotation.is(item) && item.getAttachment()["_icon"]) {
            DomUtil.removeClass(item.getAttachment()["_icon"], 'iconselected')
          } else if (ShapeAnnotation.is(item) && item.getAttachment()["_path"]) {
            this.removeSvgFilters(item)
            DomUtil.removeClass(item.getAttachment()["_path"], 'iconselected')
          } else if (ImageAnnotation.is(item) && item.getAttachment()["_image"]) {
            DomUtil.removeClass(item.getAttachment()["_image"], 'iconselected')
          }
        }
      })
      added.forEach(item => {
        if (item.getAttachment()) {
          if (MarkerTypeAnnotation.is(item) && item.getAttachment()["_icon"]) {
            DomUtil.addClass(item.getAttachment()["_icon"], 'iconselected')
          } else if (ShapeAnnotation.is(item) && item.getAttachment()["_path"]) {
            this.addSvgFilters(item)
            DomUtil.addClass(item.getAttachment()["_path"], 'iconselected')
          } else if (ImageAnnotation.is(item) && item.getAttachment()["_image"]) {
            DomUtil.addClass(item.getAttachment()["_image"], 'iconselected')
          }
        }
      })
      this.currentSelection = sel
    })
  }


  ngOnDestroy() {
    console.log("Map Destroyed!");
  }

  private clearAllLayers() {
    this.mapSvc.allMarkersLayer.clearLayers();
    this.mapSvc.newMarkersLayer.clearLayers();
    if (this.map.editTools) {
      if (this.map.editTools.editLayer) {
        this.map.editTools.editLayer.clearLayers();
      }
      if (this.map.editTools.featuresLayer) {
        this.map.editTools.featuresLayer.clearLayers();
      }
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let mapId = params.get('id')
      let center = params.get('coords')
      let zoom = parseInt(params.get('zoom'))
      let flag = params.get('flag')
      this.mapSvc.setConfigId(mapId, { center: center, zoom: zoom, flag: flag })
    })
  }

  onMapReady(map: LeafletMap) {
    console.log("Map Ready!", map, this.mapSvc._map, this.map);
    if (this.mapSvc._map && this.map) {
      return
    }
    this.map = map

    // Install plugins
    this.coords = new CoordsControl({
      decimals: 2,
      position: "bottomleft",
      labelTemplateLat: "Y: {y}",
      labelTemplateLng: "X: {x}"
    })
    this.scale = new Scale()
    new Ping(map, this.audio, this.msg).addHooks()
    new ZoomControls(this.mapSvc, {
      position: 'topleft'
    }).addTo(map)

    this.applyPrefs()
    this.zone.run(() => {
      this.mapSvc.setMap(map);
    });
  }

  removeSvgFilters(shp: ShapeAnnotation) {
  }

  addSvgFilters(shp: ShapeAnnotation) {
  }

  applyPrefs() {
    if (this.user.prefs && this.scale) {
      this.scale.show(this.map, this.user.prefs.showScale)
      this.coords.show(this.map, this.user.prefs.showCoords)
    }
  }
  setFile(f, center?: L.LatLng) {
    ImageUtil.loadImg(f).subscribe(r => {
      let sw = L.latLng(0, 0)
      let ne = L.latLng(r.height, r.width)
      let bounds = latLngBounds(sw, ne)
      let imgBounds = Rect.limitSize(bounds, this.mapSvc.overlayLayer.getBounds(), .5)

      // Get the center lat/long
      if (center) {
        imgBounds = Rect.centerOn(imgBounds, center)
      } else {
        imgBounds = Rect.centerOn(imgBounds, this.mapSvc.overlayLayer.getBounds().getCenter())
      }

      const a = new ImageAnnotation()
      a.id = 'TEMP'
      let name = r.file.name
      name = name.substr(0, name.lastIndexOf("."))
      a.name = name
      a.aspect = r.aspect
      a._blob = r.file
      a.url = r.dataURL
      a.map = this.mapCfg.id
      a.setBounds(imgBounds)

      const shp = <L.ImageOverlay>a.toLeaflet(undefined)
      shp.addTo(this.mapSvc.newMarkersLayer)

      this.mapSvc.selectForEdit(a)
    })
  }

  dragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  dragEnter(e) {
    e.stopPropagation();
    e.preventDefault();
    this.dragging = true
  }

  dragLeave(e) {
    e.stopPropagation();
    e.preventDefault();
    this.dragging = false
  }

  drop(e) {
    e.stopPropagation();
    e.preventDefault();
    this.dragging = false

    let x = e.clientX
    let y = e.clientY
    let center = this.map.mouseEventToLatLng(e)

    const files = e.dataTransfer.files;
    if (files.length >= 1) {
      this.setFile(files[0], center)
    }
    return false;
  }


}
