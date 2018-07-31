import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject, combineLatest } from 'rxjs';
import { MapType, MapConfig, MergedMapType, User, Prefs } from '../../models';
import { DataService } from '../../data.service';
import { MapService } from '../../map.service';
import { EditMapComponent } from '../../controls/edit-map/edit-map.component';
import { EditMapTypeComponent } from '../../controls/edit-map-type/edit-map-type.component';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.css']
})
export class MapSelectorComponent implements OnInit {
  @ViewChild('editmap') editmap: EditMapComponent
  @ViewChild('editfolder') editfolder: EditMapTypeComponent

  merged: Array<MergedMapType>
  filtered: Array<MergedMapType>
  recent: Array<MapConfig> = []

  edit = false
  folder: MapType
  newMapCfg: MapConfig
  isCollapsed = {}
  filter = ''

  constructor(private data: DataService, private mapSvc: MapService, private cd: CommonDialogService, private router: Router) {
    this.data.mapTypesWithMaps.subscribe(items => {
      this.merged = items
      this.updateList()
    })

    combineLatest(this.data.user, this.data.maps, this.data.mapTypesWithMaps, this.data.userPrefs).subscribe(
      (value: [User, MapConfig[], MergedMapType[], Prefs]) => {
        let items = []
        if (value[3].recentMaps) {
          value[3].recentMaps.forEach(mapId => {
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

  newFolder() {
    let f = new MapType()
    f.id = 'TEMP'
    f.name = "New Folder"
    this.edit = true
    this.folder = f
  }

  editStart() {
    this.edit = true
  }

  delete() {
    if (this.folder) {
      this.cd.confirm("Are you sure you want to delete " + this.folder.name + "? If you do then you will not be able to access the maps in this category any longer.", "Confirm Delete").subscribe(
        r => {
          if (r) {
            let f = new MapType()
            f.id = this.folder.id
            this.data.delete(f)
            this.folder = undefined
          }
        }
      )
    }
  }

  newMap() {
    let m = new MapConfig()
    m.id = 'TEMP'
    m.name = "New Map"

    this.edit = true
    this.newMapCfg = m
  }

  selectFolder(mapType: MapType) {
    this.folder = mapType
  }

  select(map: MapConfig) {
    // this.mapSvc.setConfig(map)
    this.router.navigate(['/map/' + map.id])
    this.data.saveRecentMap(map.id)
  }

  getUrl(map: MapConfig): Observable<string> {
    return this.data.url(map);
  }

  filterUpdate(event) {
    this.filter = event
    this.updateList()
  }

  save() {
    if (this.newMapCfg) {
      this.editmap.save()
    } else if (this.folder) {
      this.editfolder.save()
    }

    this.cancel()
  }

  cancel() {
    this.edit = false
    this.newMapCfg = undefined
    this.folder = undefined
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
