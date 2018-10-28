import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { MapConfig, User, Prefs, Selection, ImageAnnotation, Asset } from '../../../models';
import { latLngBounds, Layer, imageOverlay, CRS, Map as LeafletMap, LayerGroup, layerGroup, LeafletEvent, Marker, DomUtil, latLng, Transformation } from 'leaflet';
import { Trans } from '../../../util/transformation';
import { CoordsControl } from '../../../leaflet/coords';
import { Scale } from '../../../leaflet/scale';
import { MapService } from '../../map.service';
import { DataService } from '../../../data.service';
import { ActivatedRoute } from '@angular/router';
import { AudioService } from '../../../audio.service';
import { MessageService } from '../../../message.service';
import { CommandService } from '../../../command.service';
import { Rect } from '../../../util/geom';
import { ImageUtil } from '../../../util/ImageUtil';
import { Ping } from '../../../leaflet/ping';
import { ZoomControls } from '../../../leaflet/zoom-controls';
import { NotifyService } from '../../../notify.service';
import { AnnotationManager } from '../../annotation-manager';
import '../../../leaflet/path.js';
import '../../../leaflet/image-drag.js';
import '../../../leaflet/edit.js';
import { MapShareData } from 'src/app/models/system-models';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, OnDestroy {
  mapCfg: MapConfig
  map: LeafletMap

  // Need to get map 'ready' to fire
  bounds = latLngBounds([[0, 0], [50, 100]]);

  // placeholder = imageOverlay('./assets/missing.png', this.bounds)
  crs = Trans.createManualCRS(1)

  /** The layer that is used to draw the new marker on.  */
  newMarkersLayer: LayerGroup;

  /** The top level layer that all the marker layer groups are added to */
  allMarkersLayer: LayerGroup;

  overlayLayer: L.ImageOverlay


  dragging = true
  user: User
  prefs: Prefs
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
  }

  layers: Layer[] = [];

  currentSelection: Selection = new Selection([])

  constructor(private zone: NgZone, private mapSvc: MapService, private data: DataService, private route: ActivatedRoute,
    private audio: AudioService, private msg: MessageService, private cmdSvc: CommandService, private notify: NotifyService) {

    this.makeLayers()
    this.setupSubscriptions()
  }

  makeLayers() {
    this.allMarkersLayer = layerGroup()
    this.allMarkersLayer['title'] = "All Markers"

    this.newMarkersLayer = layerGroup()
    this.newMarkersLayer['title'] = "New Markers"

    this.mapSvc.allMarkersLayer = this.allMarkersLayer
    this.mapSvc.newMarkersLayer = this.newMarkersLayer
  }

  setupSubscriptions() {
    this.data.user.subscribe(u => {
      this.user = u
    })

    this.data.userPrefs.subscribe(p => {
      this.prefs = p
      this.applyPrefs()
    })
  }

  applyPrefs() {
    if (this.prefs && this.scale) {
      this.scale.show(this.map, this.prefs.showScale)
      this.coords.show(this.map, this.prefs.showCoords)
    }
  }

  ngOnInit() {
    this.route.data.subscribe((data: { asset: Asset }) => {
      this.mapCfg = <MapConfig>data.asset
      this.loadMap(this.mapCfg)
      // this.mapSvc.setConfig(this.mapCfg)
    })
  }

  ngOnDestroy() {
    console.log("Map Destroyed!");
  }

  /* ------------------------------------------------------------------------------------------ */
  /* Layer Management                                                                           */
  /* ------------------------------------------------------------------------------------------ */

  loadMap(m: MapConfig) {
    console.log("Setting Map", m);

    // Determine if this is the same map
    const old = this.mapCfg || new MapConfig()
    let sameMap = (old.id == m.id)
    // this.map['mapcfgid'] = m.id

    // Clear all the layers
    if (m.id == 'BAD' || !sameMap) {
      this.clearAllLayers()
    }

    if (m.id != "BAD") {
      this.mapCfg = m
      // this.map['title'] = m.name
      let factor = Trans.computeFactor(m)
      let transformation = Trans.createTransform(m)
      this.bounds = latLngBounds([[0, 0], [m.height / factor, m.width / factor]]);

      this.mapSvc.overlayLayer = imageOverlay(m.image, this.bounds, {pane: 'base'})
      this.crs.transformation = new Transformation(factor, 0, -factor, 0)


      // this.map.setMaxBounds(Rect.multiply(this.bounds, 1.25));

      this.layers.splice(0, this.layers.length)
      this.layers.push(this.mapSvc.overlayLayer, this.allMarkersLayer, this.newMarkersLayer)

      if (!sameMap || old.image != m.image) {
        // this.mapSvc.fit(this.bounds)
      }
    } else {
      this.mapCfg = undefined
      this.layers.splice(0, this.layers.length)
    }
  }


  /**
   * Fired when the map is ready
   * @param map Map object
   */
  onMapReady(map: LeafletMap) {
    console.log("Map Ready!", map, this.mapSvc._map, this.map);
    this.map = map

    map.createPane("fow").style.zIndex = "1000"
    map.createPane("aura").style.zIndex = "350"
    map.createPane("base").style.zIndex = "201"

    this.zone.run(() => {
      this.mapSvc.setMap(map);
      this.mapSvc.setConfig(this.mapCfg)
    });

    this.map.setMaxBounds(Rect.multiply(this.bounds, 3));
    this.mapSvc.fit(this.bounds)

    this.loadPlugins(map)
    this.loadAnnotations(map)
    this.map.on('zoomend', event => {
      const d = new MapShareData()
      d.zoom = map.getZoom()
      d.lat = map.getCenter().lat
      d.lng = map.getCenter().lng
      d.mapId = this.mapCfg.id

      if (this.mapSvc.processingEvent == false) {
        this.data.shareEvent(d)
      } else {
        this.mapSvc.processingEvent = false
      }
    })
    this.map.on('dragend', event => {
      const d = new MapShareData()
      d.zoom = map.getZoom()
      d.lat = map.getCenter().lat
      d.lng = map.getCenter().lng
      d.mapId = this.mapCfg.id

      this.data.shareEvent(d)
    })
    }

  loadPlugins(map: LeafletMap) {
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
  }

  loadAnnotations(map: LeafletMap) {
    const annotationMgr = new AnnotationManager(map, this.mapCfg, this.data, this.mapSvc, this.zone, this.notify, this.allMarkersLayer)
  }

  /**
   * Clear all the layers
   */
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


  /* ------------------------------------------------------------------------------------------ */
  /* Droppable files                                                                            */
  /* ------------------------------------------------------------------------------------------ */
  setFile(f, center?: L.LatLng) {
    ImageUtil.loadImg(f).subscribe(r => {
      let sw = latLng(0, 0)
      let ne = latLng(r.height, r.width)
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
