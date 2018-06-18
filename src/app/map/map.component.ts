import { Component, OnInit, NgZone } from '@angular/core';
import { latLngBounds, Layer, imageOverlay, CRS, Map, LayerGroup, layerGroup, LeafletEvent, Marker } from 'leaflet';
import { User, UserService } from '../user.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { MarkerService } from '../marker.service';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  user: User
  title = 'Six Kingdoms';
  bounds = latLngBounds([[0, 0], [1536, 2048]]);
  layers: Layer[] = [];
  markerLayer: LayerGroup = layerGroup()

  constructor(private zone: NgZone, private afAuth: AngularFireAuth,
    private markers: MarkerService, private userSvc: UserService, 
    private mapSvc : MapService) {
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
  }

  ngOnInit() {
  }

  // l1 = tileLayer('./assets/tiles/{z}/{x}/{y}.png', { maxZoom: 3, noWrap: true })
  l1 = imageOverlay('./assets/map2.png', this.bounds);

  options = {
    layers: [
      this.l1,
      this.markerLayer
    ],
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

    this.refresh()
    // this.options.layers
    map.fitBounds(this.bounds);

    map.on('keypress', event => {
      console.log('keypress');

    })

    this.zone.run(() => {
      this.mapSvc.setMap(map);
    });
  }
}
