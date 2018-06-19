import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MapType, MapConfig } from '../models';
import { DataService } from '../data.service';
import { UserService, User } from '../user.service';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.css']
})
export class MapSelectorComponent implements OnInit {
  mapTypes: Array<MapType>
  maps: Array<MapConfig>
  thumbs = new Map<string, string>()

  catNames = []
  items = new Map<string, Array<Holder>>()

  constructor(private data: DataService, private usrSvc: UserService, private mapSvc : MapService) {
    this.data.mapTypes.subscribe(types => {
      console.log("Map Types Updating");

      // this.mapTypes.next(types);
      this.mapTypes = types;
      this.process()
    })
    this.data.maps.subscribe(mps => {
      console.log("Maps Updating");

      // this.maps.next(mps)
      this.maps = mps
      this.process()
    })
  }

  process() {
    if (this.maps !== undefined && this.mapTypes !== undefined) {
      console.log("Processing");
      
      let newitems = new Map<string, Array<Holder>>()
      let newCatNames = new Array<string>()
      this.maps.forEach(map => {
        if (this.usrSvc.canView(map)) {
          let h = new Holder()
          h.map = map
          h.name = map.name
          this.data.url(map).subscribe( url => {
            h.url = url
          })
          let arr = newitems.get(map.mapType)
          if (arr == undefined) {
            arr = new Array<Holder>()
            newitems.set(map.mapType, arr)
          }
          arr.push(h)
        }
      });

      this.mapTypes = this.mapTypes.sort((a, b) => b.order - a.order)
      this.mapTypes.forEach(mt => {
        if (newitems.has(mt.name)) {
          newCatNames.push(mt.name)
        }
      })
      
      this.catNames = newCatNames
      this.items = newitems
    }
  }

  ngOnInit() {
  }

  select(m : Holder) {
    console.log("Selected " + m.name);
    this.mapSvc.setConfig(m.map)
    this.usrSvc.saveRecentMap(m.map.id)
  }
 
}

class Holder {
  name: string
  url?: string
  map: MapConfig
}
