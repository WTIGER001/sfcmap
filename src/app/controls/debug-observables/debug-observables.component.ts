import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { DebugUtils } from './debug-utils';
import { isArray } from 'util';
import { MapService } from '../../maps/map.service';

@Component({
  selector: 'app-debug-observables',
  templateUrl: './debug-observables.component.html',
  styleUrls: ['./debug-observables.component.css']
})
export class DebugObservablesComponent implements OnInit {
  countUserUpdates = 0
  countUserAccessUpdates = 0
  countUserMapPrefsUpdates = 0
  countUserPrefsUpdates = 0
  countMapUpdates = 0
  countMapTypeUpdates = 0
  countUsersUpdates = 0
  countMarkerTypesUpdates = 0
  countUserGroupsUpdates = 0
  countMarkerCategoriesUpdates = 0
  countMapConfigUpdates = 0
  countLeafletMapUpdates = 0
  history = []

  constructor(private data: DataService, private mapSvc: MapService) {
    this.data.user.subscribe(i => { this.countUserUpdates += 1; this.record(i, 'r', "User") })
    this.data.userAccess.subscribe(i => { this.countUserAccessUpdates += 1; this.record(i, 'r', "User Access") })
    this.data.userMapPrefs.subscribe(i => { this.countUserMapPrefsUpdates += 1; this.record(i, 'r', "Map Prefs") })
    this.data.userPrefs.subscribe(i => { this.countUserPrefsUpdates += 1; this.record(i, 'r', "Prefs") })

    this.data.gameAssets.maps.items$.subscribe(i => { this.countMapUpdates += 1; this.record(i, 'r', "Maps") })
    this.data.gameAssets.mapTypes.items$.subscribe(i => { this.countMapTypeUpdates += 1; this.record(i, 'r', "Map Types") })
    this.data.users.subscribe(i => { this.countUsersUpdates += 1; this.record(i, 'r', "Users") })
    this.data.gameAssets.markerTypes.items$.subscribe(i => { this.countMarkerTypesUpdates += 1; this.record(i, 'r', "Marker Types") })
    // this.data.groups.subscribe(i => { this.countUserGroupsUpdates += 1; this.record(i, 'r', "Groups") })
    this.data.gameAssets.markerCategories.items$.subscribe(i => { this.countMarkerCategoriesUpdates += 1; this.record(i, 'r', "Marker Categories") })

    this.mapSvc.mapConfig.subscribe(i => { this.countMapConfigUpdates += 1; this.record(i, 'r', "Map Changes") })
    this.mapSvc.map.subscribe(i => { this.countLeafletMapUpdates += 1; this.record(i, 'r', "Leaflet Map Changes") })

    this.data.saves.subscribe(i => { this.countMarkerCategoriesUpdates += 1; this.record(i, 's') })
  }

  record(item: any, action: 'r' | 's', type?: string) {
    let desc = type || ''
    if (isArray(item)) {
      const arr: any[] = item
      desc = arr.length + " " + desc
    }
    if (!type) {
      desc = item.objType + ":" + item.name
    }

    this.history.push({ desc: desc, action: action.toUpperCase(), })
  }


  ngOnInit() {
  }
  fixAll() {
    let d = new DebugUtils(this.data)
    d.fixAllObjectTypes()
  }

}
