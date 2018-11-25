import { Component, OnInit, NgZone, OnDestroy, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { MapConfig, User, Prefs, Selection, ImageAnnotation, Asset } from '../../../models';
import { latLngBounds, Layer, imageOverlay, CRS, Map as LeafletMap, LayerGroup, layerGroup, LeafletEvent, Marker, DomUtil, latLng, Transformation, CanvasLayer } from 'leaflet';
import { Trans } from '../../../util/transformation';
import { CoordsControl } from '../../../leaflet/coords';
import { Scale } from '../../../leaflet/scale';
import { MapService } from '../../map.service';
import { DataService } from '../../../data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AudioService } from '../../../audio.service';
import { MessageService } from '../../../message.service';
import { CommandService } from '../../../command.service';
import { Rect } from '../../../util/geom';
import { ImageUtil } from '../../../util/ImageUtil';
import { Ping } from '../../../leaflet/ping';
import { ZoomControls } from '../../../leaflet/zoom-controls';
import { NotifyService } from '../../../notify.service';
import { AnnotationManager } from '../../annotation-manager';
import '../../../leaflet/ElemOverlay.js';
import '../../../leaflet/path.js';
import '../../../leaflet/image-drag.js';
import '../../../leaflet/edit.js';
import '../../../leaflet/CanvasLayer1.js';
import { MapShareData } from 'src/app/models/system-models';
import { CanvasLayer2 } from '../../../leaflet/CanvasLayer.js';
import { AnnotationFactory } from '../../annotation-factory';
import { Location } from '@angular/common';

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
    center: this.bounds.getCenter(),
    doubleClickZoom: false
  }

  layers: Layer[] = [];

  currentSelection: Selection = new Selection([])
  annotationMgr: AnnotationManager;

  constructor(
    private zone: NgZone, private mapSvc: MapService, private data: DataService, private route: ActivatedRoute,
    private audio: AudioService, private msg: MessageService, private cmdSvc: CommandService, private notify: NotifyService,
    private resolver: ComponentFactoryResolver, private viewref: ViewContainerRef, private router: Router, private location : Location) {

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

      this.mapSvc.overlayLayer = imageOverlay(m.image, this.bounds, { pane: 'base' })
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

  doneone = false

  /**
   * Fired when the map is ready
   * @param map Map object
   */
  onMapReady(map: LeafletMap) {
    console.log("Map Ready!", map, this.mapSvc._map, this.map);
    this.doneone = false
    this.map = map

    this.map['mapcfgid'] = this.mapCfg.id
    this.map['title'] = this.mapCfg.name
    // Create a simple canvas layer
    // const cvs = new CanvasLayer(this.bounds, {pane: "fow"})
    // const cvs = new CanvasLayer()
    // cvs.setBounds(this.bounds)
    // cvs.delegate({
    //   onDrawLayer: function (info) {
    //     const ctx : CanvasRenderingContext2D = info.canvas.getContext('2d');
    //     ctx.clearRect(0, 0, info.canvas.width, info.canvas.height);
    //     ctx.fillStyle = "black";
    //     ctx.fillRect(0, 0, 100, 100)
    //     console.log("DRAWING")
    //   }
    // }) // -- if we do not inherit from L.CanvasLayer we can setup a delegate to receive events from L.CanvasLayer
    //   .addTo(map);




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
      this.keepRouteUpdated(map)
    })
    this.map.on('dragend', event => {
      const d = new MapShareData()
      d.zoom = map.getZoom()
      d.lat = map.getCenter().lat
      d.lng = map.getCenter().lng
      d.mapId = this.mapCfg.id

      this.data.shareEvent(d)

      this.keepRouteUpdated(map)
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

    this.route.paramMap.subscribe(params => {
      this.updateFromRoute(map, params)
    })
  }

  updateFromRoute(map: LeafletMap, params: ParamMap) {
 
    let center = params.get('coords');
    let zoom = params.get('zoom');
    let flag = params.get('flag')
    if (center) {
      let ll = center.split(',')
      let loc = latLng(parseFloat(ll[0]), parseFloat(ll[1]))
      const currentCenter = map.getCenter()

      if (Math.abs(loc.lat - currentCenter.lat) > 0.0001 && Math.abs(loc.lng - currentCenter.lng) > 0.0001) {
        if (this.doneone) {
          map.flyTo(loc)
        } else{
          this.doneone = true
          map.panTo(loc, { animate: false })
        }
        // 
      }

      if (flag) {
        Ping.showFlag(map, loc, 10000)
      }
    }
    if (zoom) {
      const zoomval: number = parseInt(zoom)
      if (!isNaN(zoomval)) {
        map.setZoom(zoomval)
      }
    }

  }

  keepRouteUpdated(map: LeafletMap) {
    this.doneone = true

    // Construct base route
    const base: any[] = ['/game', this.mapCfg.owner, 'maps', this.mapCfg.id]

    // Add 
    const center = map.getCenter()
    let coords = center.lat + "," + center.lng
    const zoom = map.getZoom()

    base.push({ coords: coords, zoom: zoom })


    // this.router.navigate(base)
    let url = this.router.createUrlTree(base).toString();
    this.location.go(url);

  }

  loadAnnotations(map: LeafletMap) {
    this.annotationMgr = new AnnotationManager(map, this.mapCfg, this.data, this.mapSvc, this.zone, this.notify, this.allMarkersLayer, this.viewref, this.resolver)
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

      // this.
      const shp = AnnotationFactory.createImage(a)
      // const shp = <L.ImageOverlay>a.toLeaflet(undefined)
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
