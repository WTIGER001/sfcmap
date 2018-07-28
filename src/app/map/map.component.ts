import { Component, OnInit, NgZone } from '@angular/core';
import { latLngBounds, Layer, imageOverlay, CRS, Map as LeafletMap, LayerGroup, layerGroup, LeafletEvent, Marker, DomUtil } from 'leaflet';
import { AngularFireAuth } from 'angularfire2/auth';
import { MapService } from '../map.service';
import { DataService } from '../data.service';
import { MapConfig, User, Selection, Annotation, MarkerTypeAnnotation, ShapeAnnotation, ImageAnnotation } from '../models';
import { ReplaySubject, of, combineLatest } from 'rxjs';
import { mergeMap, delay } from 'rxjs/operators';
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

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  mapCfg: MapConfig
  map: LeafletMap

  bounds = latLngBounds([[0, 0], [1536, 2048]]);
  mainMap = imageOverlay('https://firebasestorage.googleapis.com/v0/b/sfcmap.appspot.com/o/images%2Ff1d8f636-6e8e-bde6-15b0-af7f81571c12?alt=media&token=582b3c4c-f8d5-44bd-a211-f3c609f0b23a', this.bounds);
  crs = Trans.createManualCRS(6)

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
  };

  layers: Layer[] = [this.mainMap];

  currentSelection: Selection = new Selection([])

  constructor(private zone: NgZone, private afAuth: AngularFireAuth,
    private mapSvc: MapService, private data: DataService, private route: ActivatedRoute, private audio: AudioService, private msg: MessageService) {

    this.data.user.subscribe(u => {
      this.user = u
      this.applyPrefs()
    })

    let map$ = this.mapSvc.map
    let mapCfg$ = this.mapSvc.mapConfig

    combineLatest(map$, mapCfg$).subscribe((incoming: [LeafletMap, MapConfig]) => {
      this.map = incoming[0]
      const old = this.mapCfg || new MapConfig()

      // Check if this is the same map as before. If so then we dont want to reset the zoom and pan.
      let sameMap = (old.id == incoming[1].id)
      this.mapCfg = incoming[1]
      let m = this.mapCfg
      console.log("Map Changed!", this.crs);
      this.map['mapcfgid'] = m.id
      if (m.id != "BAD") {
        this.mapSvc.allMarkersLayer.clearLayers()
        this.mapSvc.newMarkersLayer.clearLayers()
        if (this.map.editTools) {
          if (this.map.editTools.editLayer) {
            this.map.editTools.editLayer.clearLayers()
          }
          if (this.map.editTools.featuresLayer) {
            this.map.editTools.featuresLayer.clearLayers()
          }
        }

        let factor = Trans.computeFactor(m)
        let transformation = Trans.createTransform(m)
        let bounds = latLngBounds([[0, 0], [m.height / factor, m.width / factor]]);

        if (!sameMap || old.image != m.image) {
          this.mapSvc.overlayLayer = imageOverlay(m.image, bounds)
        }
        // let mapLayer = imageOverlay(m.image, bounds)
        // mapLayer['title'] = "Base Map"
        // this.mapSvc.overlayLayer = mapLayer
        this.crs.transformation = new L.Transformation(factor, 0, -factor, 0)
        this.map.setMaxBounds(Rect.multiply(bounds, 1.25));

        if (!sameMap || old.image != m.image) {
          this.layers.splice(0, this.layers.length)
          this.layers.push(this.mapSvc.overlayLayer)
          this.layers.push(this.mapSvc.allMarkersLayer)
          this.layers.push(this.mapSvc.newMarkersLayer)
          this.mapSvc.fit(bounds)
        }
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
    this.map = map
    console.log("Map Ready!", map);

    this.scale = new Scale()

    // Install plugins
    this.coords = new CoordsControl({
      decimals: 2,
      position: "bottomleft",
      labelTemplateLat: "Y: {y}",
      labelTemplateLng: "X: {x}"
    })
    // this.coords = L.control.coordinates(
    //   {
    //     decimals: 2,
    //     position: "bottomleft",
    //     labelTemplateLat: "Y: {y}",
    //     labelTemplateLng: "X: {x}",
    //     enableUserInput: false
    //   }
    // )
    // this.coords['_update'] = function (evt) {
    //   var pos = evt.latlng,
    //     opts = this.options;
    //   if (pos) {
    //     this._currentPos = pos;
    //     this._label.innerHTML = this._createCoordinateLabel(pos);
    //   }
    // }

    let ping = new Ping(map, this.audio, this.msg);

    let a = new ZoomControls(this.mapSvc, {
      position: 'topleft'
    })
    a.addTo(map)

    // L.control.scale().addTo(map)
    this.applyPrefs()
    ping.addHooks()

    this.zone.run(() => {
      this.mapSvc.setMap(map);
    });
  }

  removeSvgFilters(shp: ShapeAnnotation) {
    // const el: HTMLElement = shp.getAttachment().getElement()
    // const svg: HTMLElement = el.parentElement.parentElement
    // let old = svg.getElementsByClassName("svghighlight")
    // if (old.length > 0) {
    //   svg.removeChild(old.item(0))
    // }
  }

  addSvgFilters(shp: ShapeAnnotation) {

    // const el: HTMLElement = shp.getAttachment().getElement()
    // const svg: HTMLElement = el.parentElement.parentElement
    // const len = svg.childNodes.length
    // let defsFound = false
    // for (let i = 0; i < len; i++) {
    //   let elChild = svg.childNodes.item(i)
    //   if (elChild.nodeName == 'DEFS') {
    //     defsFound = true;
    //     break;
    //   }
    // }
    // if (!defsFound) {
    //   const defs = DomUtil.create('defs', "temp", svg)
    //   DomUtil.removeClass(defs, 'temp')
    //   defs.innerHTML = '<filter id="shadow2" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow _ngcontent-c5="" dx="0" dy="0" flood-color="white" flood-opacity="1" stdDeviation="10"></feDropShadow></filter>'
    // }

    // const g = DomUtil.create('g', 'svghighlight', svg)

    // let shadow = <HTMLElement>el.cloneNode(true)
    // shadow.setAttribute('filter', "url(#shadow2)")
    // // DomUtil.addClass(shadow, 'svghighlight')
    // g.appendChild(shadow)
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

      console.log("ANNOATION CREATED: ", this.applyPrefs);
      const shp = <L.ImageOverlay>a.toLeaflet(undefined)
      shp.addTo(this.mapSvc.newMarkersLayer)

      this.mapSvc.selectForEdit(a)
    })
  }

  dragOver(e) {
    // console.log("OVER");
    e.stopPropagation();
    e.preventDefault();
  }

  dragEnter(e) {
    console.log("ENTER");

    e.stopPropagation();
    e.preventDefault();
    this.dragging = true
  }

  dragLeave(e) {
    console.log("LEAVING");

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
