import { Component, OnInit } from '@angular/core';
import { MapService, MyMarker } from '../../map.service';
import { Map as LeafletMap, LayerGroup, Marker } from 'leaflet';
import { delay, mergeMap, map as rxmap, map } from 'rxjs/operators';
import { ITreeOptions } from 'angular-tree-component';
import { ITreeNode } from 'angular-tree-component/dist/defs/api';
import { MapConfig, MarkerGroup, SavedMarker, User, MapPrefs } from '../../models';
import { DataService } from '../../data.service';
import { combineLatest } from 'rxjs';
import { CommonDialogService } from '../../dialogs/common-dialog.service';

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

    let allObs = this.mapSvc.mapConfig
      .pipe(
        mergeMap(mapConfig => {
          this.mapConfig = mapConfig;
          this.isCollapsed = {}
          return this.data.getCompleteMarkerGroups(mapConfig.id)
        }),
        map(groups => {
          this.groups = groups
          this.groups.forEach(g => {
            if (!this.isCollapsed.hasOwnProperty(g.id)) {
              this.isCollapsed[g.id] = true
            }
          })
        })
      )


    combineLatest(prefObs, allObs)
      .subscribe(() => {
        this._shownGroups = this.prefs.getMapPref(this.mapConfig.id).hiddenGroups
        this._shownMarkers = this.prefs.getMapPref(this.mapConfig.id).hiddenMarkers
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
    console.log(item);

    return item.eachLayer
  }

  activate(event) {
    console.log(event);
    let me: ITreeNode = event.node
    if (me) {
      let item = me.data.data
      if (item['__id']) {
        let m = new MyMarker(item)
        this.mapSvc.panTo(item['_latlng'])
      }
    }
  }

  groupCheckChange($event) {
    console.log($event);
    // this.shownGroups = $event
    if (this.prefs) {
      let mPrefs = this.prefs.getMapPref(this.mapConfig.id)
      mPrefs.hiddenGroups = $event
      console.log("Hidden Groups")
      console.log(mPrefs.hiddenGroups);
      this.data.save(this.prefs)
    }
  }

  markerCheckChange($event) {
    console.log($event);

    if (this.prefs) {
      if (!this.prefs.maps) {
        this.prefs.maps = new Map<string, MapPrefs>()
      }
      let mPrefs = this.prefs.getMapPref(this.mapConfig.id)
      mPrefs.hiddenMarkers = $event
      console.log("Hidden Markers")
      console.log(mPrefs.hiddenMarkers);
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

  drop(item: SavedMarker | MarkerGroup, group: MarkerGroup) {
    if (MarkerGroup.is(item) && group.id != item.id) {
      let gid = group.id == DataService.UNCATEGORIZED ? '' : group.id
      item.markers.forEach(m => {
        m.markerGroup = gid
        this.data.saveMarker(m)
      })
      this.data.delete(group)
    }
    if (SavedMarker.is(item) && item.markerGroup != group.id) {
      if (group.id == DataService.UNCATEGORIZED && item.markerGroup != '') {
        item.markerGroup = ''
        this.data.saveMarker(item)
      }

      if (group.id != DataService.UNCATEGORIZED) {
        item.markerGroup = group.id
        this.data.saveMarker(item)
      }
    }
  }

  trash(item: SavedMarker | MarkerGroup) {
    if (MarkerGroup.is(item)) {
      if (item.markers.length > 0) {
        this.dialog.confirm("Are you sure you want to delete " + item.name + "? It has " + item.markers.length + " markers that will also be deleted.").subscribe(result => {
          if (result) {
            item.markers.forEach(m => {
              this.data.deleteMarker(m)
            })
            this.data.delete(item)
          }
        })
      } else {
        this.data.delete(item)
      }
    } else if (SavedMarker.is(item)) {
      this.data.deleteMarker(item)
    }
  }

  manageLayers() {

  }
}
