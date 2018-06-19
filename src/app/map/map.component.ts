import { Component, OnInit, NgZone } from '@angular/core';
import { latLngBounds, Layer, imageOverlay, CRS, Map, LayerGroup, layerGroup, LeafletEvent, Marker } from 'leaflet';
import { User, UserService } from '../user.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { MarkerService } from '../marker.service';
import { MapService } from '../map.service';
import { DataService } from '../data.service';
import { MapConfig } from '../models';
import { flatten } from '@angular/compiler';
import { ReplaySubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  // mapCfgObs = new ReplaySubject();
  mapCfg : MapConfig
  map : Map

  user: User
  title = 'Six Kingdoms';
  bounds = latLngBounds([[0, 0], [1536, 2048]]);
  layers: Layer[] = [];
  markerLayer: LayerGroup = layerGroup()

  constructor(private zone: NgZone, private afAuth: AngularFireAuth,
    private markers: MarkerService, private userSvc: UserService, 
    private mapSvc : MapService, private data : DataService) {

    this.userSvc.user.subscribe(u => {
      this.user = u
    })
    this.markers.markersObs.subscribe(
      items => this.refresh()
    )
    this.markerLayer.addEventListener('click', (event: LeafletEvent) => {
      console.log("Clicked2");

      var m = <Marker>event.target
      this.markers.select(m)
    })
    this.markerLayer.on('click', (event: LeafletEvent) => {
      console.log("Clicked");

      var m = <Marker>event.target
      this.markers.select(m)
    })
    this.markerLayer.on('move', (event: LeafletEvent) => {
      console.log("Moved");

      this.zone.run(() => {
        var m = <Marker>event.target
        this.markers.update(m)
      });
    })
    // this.data.groups.subscribe( groups => {
    //   console.log(groups);
    // })
 
    // this.data.maps.subscribe( maps => {
    //   this.mapCfg = maps.find(v => v.name == "Six Kingdoms")
    //   this.mapCfgObs.next(this.mapCfg)
    // })

    // this.mapCfgObs.pipe(
    //   mergeMap( (m : MapConfig)=>  this.data.url(m) )
    // ).subscribe( url => {
    //   console.log("Download url " + url);
      
    //   let bounds = latLngBounds([[0, 0], [this.mapCfg.height, this.mapCfg.width]]);
    //   let mapLayer = imageOverlay(url, bounds)
    //   this.options.layers.splice(0, this.options.layers.length)
    //   this.layers.push(mapLayer)
      
    //   // this.options.layers.push(this.markerLayer)
    // })

    this.mapSvc.mapConfig.pipe(
      mergeMap( (m : MapConfig)=>  {
        this.mapCfg = m
        return this.data.url(m) 
      })
    ).subscribe( url => {
      console.log("Download url " + url);
      
      let bounds = latLngBounds([[0, 0], [this.mapCfg.height, this.mapCfg.width]]);
      let mapLayer = imageOverlay(url, bounds)
      this.layers.splice(0, this.layers.length)
      this.layers.push(mapLayer)
      this.layers.push(this.markerLayer)
      this.refresh()
      this.mapSvc.fit(bounds)
    })

    this.layers.push(this.l1)
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


  refresh() {
    let items = this.markers.getViewableMarkers("john")
    console.log("Adding Markers: " + items.length);
    this.markerLayer.clearLayers()
    if (items.length > 0) {
      items.forEach(m => {
        m.marker.addEventListener('click', event => {
          console.log("Clicked3");
          this.zone.run(() => {
            var m = <Marker>event.target
            this.markers.select(m)
          });
        })
        this.markerLayer.addLayer(m.marker)
      })
    }
  }

  onMapReady(map: Map) {
    this.map = map
    this.zone.run(() => {
      this.mapSvc.setMap(map);
    });
  }
}
