import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject, combineLatest } from 'rxjs';
import { MapType, MapConfig, MergedMapType, UserPreferences } from '../../models';
import { DataService } from '../../data.service';
import { MapService } from '../../map.service';

@Component({
  selector: 'app-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.css']
})
export class MapSelectorComponent implements OnInit {
  merged: Array<MergedMapType>
  filtered: Array<MergedMapType>
  recent: Array<MapConfig> = []

  isCollapsed = {}
  filter = ''

  constructor(private data: DataService, private mapSvc: MapService) {
    this.data.mapTypesWithMaps.subscribe(items => {
      this.merged = items
      this.updateList()
    })

    combineLatest(this.data.userPrefs, this.data.maps, this.data.mapTypesWithMaps).subscribe(
      (value: [UserPreferences, MapConfig[], MergedMapType[]]) => {
        console.log("Processing Recent Items", value);
        let items = []
        if (value[0].recentMaps) {
          value[0].recentMaps.forEach(mapId => {
            let map = value[1].find(m => mapId == m.id)
            if (map) {
              items.push(map)
            }
          })
          this.recent = items;
        }
      }
    )
  }

  ngOnInit() {
  }

  select(map: MapConfig) {
    this.mapSvc.setConfig(map)
    this.data.saveRecentMap(map.id)
  }

  getUrl(map: MapConfig): Observable<string> {
    return this.data.url(map);
  }

  filterUpdate(event) {
    this.filter = event
    this.updateList()
  }

  clearFilter() {
    if (this.filter.length > 0) {
      this.filter = ''
      this.updateList()
    }
  }

  updateList() {
    if (this.filter && this.filter.length > 0) {
      let searchFor = this.filter.toLowerCase()

      let items = new Array<MergedMapType>()

      this.merged.forEach(cat => {
        let single = new MergedMapType()
        single.maps = []
        single.name = cat.name
        single.id = cat.id

        cat.maps.forEach(map => {
          if (map.name.toLowerCase().includes(searchFor)) {
            single.maps.push(map)
          }
        })

        if (single.maps.length > 0) {
          items.push(single)
        }
      })
      this.filtered = items
    } else {
      this.filtered = this.merged
    }
  }
}
