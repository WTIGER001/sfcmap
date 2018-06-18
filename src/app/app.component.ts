import { Component } from '@angular/core'
import { MarkerService } from './marker.service'
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { Layer, marker, icon, latLng, LatLng, tileLayer, latLngBounds, imageOverlay, CRS, Map, Point, LatLngBoundsExpression, Marker } from 'leaflet';
import { UserService, User } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public afAuth: AngularFireAuth, private markers: MarkerService, private userSvc: UserService) {
    this.userSvc.user.subscribe(u => {
      this.user = u
    })
  }
  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  user: User
  title = 'Six Kingdoms';
  bounds = latLngBounds([[0, 0], [1536, 2048]]);
  layers: Layer[] = [];

  // l1 = tileLayer('./assets/tiles/{z}/{x}/{y}.png', { maxZoom: 3, noWrap: true })
  l1 = imageOverlay('./assets/map2.png', this.bounds);

  options = {
    layers: [
      this.l1
    ],
    zoom: 1,
    minZoom: -2,
    // maxZoom: 3,
    continousWorld: false,
    crs: CRS.Simple
  };


  refresh() {
    let items = this.markers.getViewableMarkers("john")
    console.log("ITEMS: " + items.length);
    console.log(items[0]);


    this.layers.push(items[0].marker)
  }

  onMapReady(map: Map) {


    // map.setView([0, 0], 1)

    // var southWest = map.unproject([0, 2048], map.getMaxZoom());
    // var northEast = map.unproject([1536, 0], map.getMaxZoom());

    // console.log("SW " + southWest.toString());
    // console.log("NE " + northEast.toString());

    // map.fitBounds(latLngBounds([
    //   southWest,
    //   northEast
    // ]))

    this.refresh()
    // this.options.layers
    map.fitBounds(this.bounds);

  }



}
