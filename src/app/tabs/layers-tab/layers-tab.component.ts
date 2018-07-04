import { Component, OnInit } from '@angular/core';
import { MapService, MyMarker } from '../../map.service';
import { Map as LeafletMap, LayerGroup } from 'leaflet';
import { delay, mergeMap, map as rxmap, map } from 'rxjs/operators';
import { ITreeOptions } from 'angular-tree-component';
import { ITreeNode } from 'angular-tree-component/dist/defs/api';
import { MapConfig, MarkerGroup, SavedMarker, User, MapPrefs } from '../../models';
import { DataService } from '../../data.service';
import { combineLatest } from 'rxjs';

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

  constructor(private mapSvc: MapService, private data: DataService) {
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
          return this.data.getCompleteMarkerGroups(mapConfig.id)
        }),
        map(groups => {
          this.groups = groups
          this.groups.forEach(g => {
            this.isCollapsed[g.id] = true
          })
        })
      )


    combineLatest(prefObs, allObs)
      .subscribe(() => {
        this._shownGroups = this.prefs.getMapPref(this.mapConfig.id).hiddenGroups
        this._shownMarkers = this.prefs.getMapPref(this.mapConfig.id).hiddenMarkers
        console.log("ALL DONE");
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
}
