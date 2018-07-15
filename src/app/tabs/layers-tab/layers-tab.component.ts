import { Component, OnInit } from '@angular/core';
import { MapService } from '../../map.service';
import { Map as LeafletMap, LayerGroup, Marker } from 'leaflet';
import { delay, mergeMap, map as rxmap, map } from 'rxjs/operators';
import { ITreeOptions } from 'angular-tree-component';
import { ITreeNode } from 'angular-tree-component/dist/defs/api';
import { MapConfig, MarkerGroup, User, MapPrefs, Annotation } from '../../models';
import { DataService } from '../../data.service';
import { combineLatest, of } from 'rxjs';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { log } from 'util';

@Component({
  selector: 'app-layers-tab',
  templateUrl: './layers-tab.component.html',
  styleUrls: ['./layers-tab.component.css']
})
export class LayersTabComponent implements OnInit {
  prefs: User
  map: LeafletMap
  mapConfig: MapConfig
  groups: MarkerGroup[] = []
  // markers: SavedMarker[] = []
  layers = []
  items = []
  groupIds = []
  markerIds = []
  dragging
  isCollapsed = {}
  options: ITreeOptions = {
    useCheckbox: true
  };

  constructor(private mapSvc: MapService, private data: DataService, private dialog: CommonDialogService) {
    this.mapSvc.map
      .subscribe(m => {
        this.map = m
        this.layers = this.mapSvc.layers
      })

    let prefObs = this.data.user.pipe(
      map(prefs => this.prefs = prefs)
    )

    let mapObs = this.mapSvc.mapConfig.pipe(
      map(mapConfig => this.mapConfig = mapConfig)
    )

    let allObs = this.mapSvc.completeMarkerGroups.pipe(
      map(groups => {
        this.groups = groups
        this.groups.forEach(g => {
          if (!this.isCollapsed.hasOwnProperty(g.id)) {
            this.isCollapsed[g.id] = true
          }
        })
      })
    )

    combineLatest(prefObs, allObs, mapObs)
      .subscribe((result) => {
        let mapCfg = result[2]
        this._shownGroups = this.prefs.getMapPref(mapCfg.id).hiddenGroups
        this._shownMarkers = this.prefs.getMapPref(mapCfg.id).hiddenMarkers
      })

  }

  ngOnInit() {
  }

  name(item) {
    if (item.options && item.options.title) {
      return item.options.title
    }
    if (item['__name']) {
      return item['__name']
    }
    return '--unknown--'
  }

  id(item) {
    if (item['__id']) {
      return item['__id']
    }
    return this.name(item)
  }

  isFeatureGroup(item: any): item is LayerGroup {
    return item.eachLayer
  }

  groupCheckChange($event) {
    // this.shownGroups = $event
    if (this.prefs) {
      let mPrefs = this.prefs.getMapPref(this.mapConfig.id)
      mPrefs.hiddenGroups = $event
      this.data.save(this.prefs)
    }
  }

  markerCheckChange($event) {
    if (this.prefs) {
      if (!this.prefs.maps) {
        this.prefs.maps = new Map<string, MapPrefs>()
      }
      let mPrefs = this.prefs.getMapPref(this.mapConfig.id)
      mPrefs.hiddenMarkers = $event
      this.data.save(this.prefs)
    }
  }

  diff<T>(all: T[], some: T[]): T[] {
    return all.filter(allItem => !some.includes(allItem))
  }

  _shownGroups = []
  _shownMarkers = []

  set shownGroups(v: any[]) {
    this._shownGroups = v
    this.groupCheckChange(v)
  }

  set shownMarkers(v: any[]) {
    this._shownMarkers = v
    this.markerCheckChange(v)
  }

  get shownGroups(): any[] {
    return this._shownGroups
  }

  get shownMarkers(): any[] {
    return this._shownMarkers
  }

  drop(item: Annotation | MarkerGroup, group: MarkerGroup) {
    if (MarkerGroup.is(item) && group.id != item.id) {
      let gid = group.id == DataService.UNCATEGORIZED ? '' : group.id
      item.annotations.forEach(m => {
        m.group = gid
        this.data.save(m)
      })
      this.data.delete(group)
    }
    if (Annotation.is(item) && item.group != group.id) {
      if (group.id == DataService.UNCATEGORIZED && item.group != '') {
        item.group = ''
        this.data.save(item)
      }

      if (group.id != DataService.UNCATEGORIZED) {
        item.group = group.id
        this.data.save(item)
      }
    }
  }

  trash(item: Annotation | MarkerGroup) {
    if (MarkerGroup.is(item)) {
      if (item.annotations.length > 0) {
        this.dialog.confirm("Are you sure you want to delete " + item.name + "? It has " + item.annotations.length + " markers that will also be deleted.").subscribe(result => {
          if (result) {
            item.annotations.forEach(m => {
              this.data.delete(m)
            })
            this.data.delete(item)
          }
        })
      } else {
        this.data.delete(item)
      }
    } else if (Annotation.is(item)) {
      this.data.delete(item)
    }
  }

  manageLayers() {

  }
}
