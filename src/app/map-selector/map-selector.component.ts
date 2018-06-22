import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MapType, MapConfig, MergedMapType } from '../models';
import { DataService } from '../data.service';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.css']
})
export class MapSelectorComponent implements OnInit {
  merged : Array<MergedMapType>

  constructor(private data: DataService, private mapSvc : MapService) {
    this.data.mapTypesWithMaps.subscribe( items => {
      this.merged = items
    })
  }

  ngOnInit() {
  }

  select (map : MapConfig) {
    this.mapSvc.setConfig(map)
    this.data.saveRecentMap(map.id)
  } 
 
  getUrl(map : MapConfig) : Observable<string>{
    return this.data.url(map);
  }
}
