import { Component, OnInit, NgZone, ViewContainerRef, ElementRef } from '@angular/core';
import { Application, Container, Sprite } from 'pixi.js'
import { Viewport, ViewportOptions } from 'pixi-viewport'
import { User, Prefs, Selection, MapConfig, Asset } from 'src/app/models';
import { AnnotationManager } from '../../annotation-manager';
import { MapService } from '../../map.service';
import { DataService } from 'src/app/data.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NotifyService } from 'src/app/notify.service';
import { CommandService } from 'src/app/command.service';
import { MessageService } from 'src/app/message.service';
import { AudioService } from 'src/app/audio.service';

@Component({
  selector: 'app-map-pixi',
  templateUrl: './map-pixi.component.html',
  styleUrls: ['./map-pixi.component.css']
})
export class MapPixiComponent implements OnInit {

  // Application for Pixijs
  app: Application

  // Viewport
  viewport: Viewport

  // Layers
  mapLayer: Container

  // Config 
  mapCfg: MapConfig


  dragging = true
  user: User
  prefs: Prefs

  currentSelection: Selection = new Selection([])
  annotationMgr: AnnotationManager;

  constructor(
    private elementRef: ElementRef,
    private zone: NgZone, private mapSvc: MapService, private data: DataService, private route: ActivatedRoute,
    private audio: AudioService, private msg: MessageService, private cmdSvc: CommandService, private notify: NotifyService,
     private viewref: ViewContainerRef, private router: Router, private location: Location) {

    this.setupSubscriptions()

  }

  ngOnInit(): void {
    // Load the Map Configuration
    this.route.data.subscribe((data: { asset: Asset }) => {
      this.mapCfg = <MapConfig>data.asset
      this.loadMap(this.mapCfg)
    })

    this.zone.runOutsideAngular(() => {
      this.app = new Application({
        // autoResize: true,
        resolution: devicePixelRatio
      });
    });
    this.elementRef.nativeElement.appendChild(this.app.view);

    // Listen for window resize events
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  // Resize function window
  resize() {
    // Resize the renderer
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }

  makeMap() {
    this.viewport = new Viewport(

    )

    this.app.stage.addChild(this.viewport)

    this.viewport
      .drag()
      .pinch()
      .wheel()
      .decelerate()

    // Make the background layer where the map image is held
    this.mapLayer = new Container()
    this.viewport.addChild(this.mapLayer)
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
    // if (this.prefs && this.scale) {
    //   this.scale.show(this.map, this.prefs.showScale)
    //   this.coords.show(this.map, this.prefs.showCoords)
    // }
  }


  ngOnDestroy() {
    console.log("Map Destroyed!");
  }

  /* ------------------------------------------------------------------------------------------ */
  /* Layer Management                                                                           */
  /* ------------------------------------------------------------------------------------------ */
  mapSprite: Sprite

  loadMap(m: MapConfig) {
    console.log("Setting Map", m);

    // Remove the old map if there is one
    if (this.mapSprite) {
      this.mapSprite.removeChild()
      this.mapSprite.destroy()
      this.mapSprite = null
    }

    // Create the map Sprite 
    this.mapSprite = Sprite.from(m.image)
    this.mapLayer.addChild(this.mapSprite)

    // Set the Size
    this.viewport.worldWidth = 1.5 * m.width
    this.viewport.worldHeight = 1.5 * m.height
    this.viewport.interactive = true
  }

  doneone = false

  updateFromRoute(app: Application, params: ParamMap) {

    // let center = params.get('coords');
    // let zoom = params.get('zoom');
    // let flag = params.get('flag')
    // if (center) {
    //   let ll = center.split(',')
    //   let loc = latLng(parseFloat(ll[0]), parseFloat(ll[1]))
    //   const currentCenter = map.getCenter()

    //   if (Math.abs(loc.lat - currentCenter.lat) > 0.0001 && Math.abs(loc.lng - currentCenter.lng) > 0.0001) {
    //     if (this.doneone) {
    //       map.flyTo(loc)
    //     } else{
    //       this.doneone = true
    //       map.panTo(loc, { animate: false })
    //     }
    //     // 
    //   }

    //   if (flag) {
    //     Ping.showFlag(map, loc, 10000)
    //   }
    // }
    // if (zoom) {
    //   const zoomval: number = parseInt(zoom)
    //   if (!isNaN(zoomval)) {
    //     map.setZoom(zoomval)
    //   }
    // }

  }

  // keepRouteUpdated(map: LeafletMap) {
  //   this.doneone = true

  //   // Construct base route
  //   const base: any[] = ['/game', this.mapCfg.owner, 'maps', this.mapCfg.id]

  //   // Add 
  //   const center = map.getCenter()
  //   let coords = center.lat + "," + center.lng
  //   const zoom = map.getZoom()

  //   base.push({ coords: coords, zoom: zoom })


  //   // this.router.navigate(base)
  //   let url = this.router.createUrlTree(base).toString();
  //   this.location.go(url);

  // }

  // loadAnnotations(map: LeafletMap) {
  //   this.annotationMgr = new AnnotationManager(map, this.mapCfg, this.data, this.mapSvc, this.zone, this.notify, this.allMarkersLayer, this.viewref, this.resolver)
  // }


  // /* ------------------------------------------------------------------------------------------ */
  // /* Droppable files                                                                            */
  // /* ------------------------------------------------------------------------------------------ */
  // setFile(f, center?: L.LatLng) {
  //   ImageUtil.loadImg(f).subscribe(r => {
  //     let sw = latLng(0, 0)
  //     let ne = latLng(r.height, r.width)
  //     let bounds = latLngBounds(sw, ne)
  //     let mapBounds = this.mapSvc.overlayLayer ? this.mapSvc.overlayLayer.getBounds() : this.map.getBounds()
  //     let imgBounds = Rect.limitSize(bounds, mapBounds, .5)

  //     // Get the center lat/long
  //     if (center) {
  //       imgBounds = Rect.centerOn(imgBounds, center)
  //     } else {
  //       imgBounds = Rect.centerOn(imgBounds, mapBounds.getCenter())
  //     }

  //     const a = new ImageAnnotation()
  //     a.id = 'TEMP'
  //     let name = r.file.name
  //     name = name.substr(0, name.lastIndexOf("."))
  //     a.name = name
  //     a.aspect = r.aspect
  //     a._blob = r.file
  //     a.url = r.dataURL
  //     a.map = this.mapCfg.id
  //     a.setBounds(imgBounds)

  //     // this.
  //     const shp = AnnotationFactory.createImage(a)
  //     shp.addTo(this.mapSvc.newMarkersLayer)

  //     this.mapSvc.selectForEdit(a)
  //   })
  // }

  // dragOver(e) {
  //   e.stopPropagation();
  //   e.preventDefault();
  // }

  // dragEnter(e) {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   this.dragging = true
  // }

  // dragLeave(e) {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   this.dragging = false
  // }

  // drop(e) {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   this.dragging = false

  //   let x = e.clientX
  //   let y = e.clientY
  //   let center = this.map.mouseEventToLatLng(e)

  //   const files = e.dataTransfer.files;
  //   if (files.length >= 1) {
  //     this.setFile(files[0], center)
  //   }
  //   return false;
  // }
}
