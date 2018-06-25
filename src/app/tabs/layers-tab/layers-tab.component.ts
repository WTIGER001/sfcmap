import { Component, OnInit } from '@angular/core';
import { MapService } from '../../map.service';
import { Map as LeafletMap, LayerGroup } from 'leaflet';
import { delay, mergeMap, map as rxmap } from 'rxjs/operators';
import { ITreeOptions } from 'angular-tree-component';
import { ITreeNode } from 'angular-tree-component/dist/defs/api';
import { MyMarker } from '../../marker.service';
import { MapConfig, MarkerGroup, SavedMarker } from '../../models';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-layers-tab',
  templateUrl: './layers-tab.component.html',
  styleUrls: ['./layers-tab.component.css']
})
export class LayersTabComponent implements OnInit {
  map: LeafletMap
  mapConfig: MapConfig
  groups: MarkerGroup[] = []
  markers: SavedMarker[] = []
  layers = []
  items = []
  shownGroups = []
  shownMarkers = []
  isCollapsed = new Map<string, boolean>()
  options: ITreeOptions = {
    useCheckbox: true
  };

  constructor(private mapSvc: MapService, private data: DataService) {
    this.mapSvc.mapConfig
      .pipe(
        mergeMap(mapConfig => {
          this.mapConfig = mapConfig;
          return this.data.getMarkerGroups(mapConfig.id)
        }),
        mergeMap(groups => {
          this.groups = groups
          this.groups.forEach(g => {
            this.shownGroups.push(g.id)
          })
          return this.data.getMarkers(this.mapConfig.id)
        })
      ).subscribe(marks => {
        this.markers = marks
        this.markers.forEach(m => {
          this.shownMarkers.push(m.id)
        })
        console.log("Marker Count " + this.markers.length);
      })

    this.mapSvc.map
      .subscribe(m => {
        this.map = m
        this.layers = this.mapSvc.layers
      })

    this.mapSvc.mapConfig.pipe(delay(100)).subscribe(mapConfig => {
      this.items = this.generateTreeItems()
    })
  }

  getMarkers(g: MarkerGroup): SavedMarker[] {
    return this.markers.filter(m => {
      if (m.markerGroup) {
        return m.markerGroup == g.id
      }
      return false;
    })
  }
  getUngroupedMarkers(): SavedMarker[] {
    return this.markers.filter(m => {
      if (m.markerGroup) {
        return false
      }
      return true;
    })
  }

  onSelectChange(event) {

  }

  onFilterChange(event) {

  }

  generateTreeItems(): any[] {

    let items = []
    console.log("Layer COunt " + this.layers.length);
    this.layers.forEach(layer => {
      console.log("Layer : " + this.name(layer));
      let child = this.genTree(layer)
      console.log("... created" + child.text);
      items.push(child)
    })
    console.log("Item count " + items.length);

    return items
  }

  genTree(obj: any): any {
    console.log("Item : " + this.name(obj));
    let item = {
      name: this.name(obj),
      id: this.id(obj),
      data: obj,
      children: []
    }

    if (this.isFeatureGroup(obj)) {
      console.log("FeatureLayer : " + this.name(obj));
      obj.eachLayer(l => {
        let child = this.genTree(l)
        item.children.push(child)
      })
    }
    return item
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
}
