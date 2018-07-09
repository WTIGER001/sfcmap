import { Component, OnInit, NgZone } from '@angular/core';
import { MapService } from '../../map.service';
import { DataService } from '../../data.service';
import { MapConfig, Distance } from '../../models';
import { Map as LeafletMap, GridLayerOptions } from 'leaflet';
import { CalibrateX } from '../../leaflet/calibrate';
import { DialogService } from '../../dialogs/dialog.service';
import { Measure } from '../../leaflet/measure';
import { Rgba } from 'ngx-color-picker';
import { DistanceUnit } from '../../util/transformation';
import { GridLayer, GridOptions } from '../../leaflet/grid';

@Component({
  selector: 'app-map-tab',
  templateUrl: './map-tab.component.html',
  styleUrls: ['./map-tab.component.css']
})
export class MapTabComponent implements OnInit {
  mapCfg: MapConfig
  map: LeafletMap

  calibrateX: CalibrateX
  measureXY: Measure
  units = DistanceUnit.units

  grid: GridLayer

  gridOptions: GridOptions

  constructor(private mapSvc: MapService, private data: DataService, private dialog: DialogService, private zone: NgZone) {
    this.mapSvc.mapConfig.subscribe(m => this.mapCfg = m)
    this.mapSvc.map.subscribe(m => this.map = m)
    this.grid = new GridLayer(this.mapSvc)
    this.gridOptions = this.grid.options
  }

  ngOnInit() {
  }

  addMarker() {

  }

  public toggleGrid(arg: any) {
    if (this.gridOptions.enabled) {
      this.grid.addTo(this.map)
    } else {
      this.grid.remove()
    }
  }

  public updateGrid(arg: any) {
    if (this.gridOptions.enabled) {
      this.grid.refresh()
    }
  }

  calibrate() {
    if (this.calibrateX) {
      this.calibrateX.disable()
    } else {
      this.map.dragging.disable()
      this.map.doubleClickZoom.disable()
      this.calibrateX = new CalibrateX(this.map, this.mapCfg, this.dialog, this.zone, this.data, this.mapSvc)
      this.calibrateX.enable()
      this.calibrateX.onDisable(() => {
        this.map.dragging.enable()
        this.map.doubleClickZoom.enable()
        this.calibrateX = undefined
      })
    }
  }

  measure() {
    if (this.measureXY) {
      this.measureXY.disable()
    } else {
      this.map.dragging.disable()
      this.map.doubleClickZoom.disable()
      this.measureXY = new Measure(this.map, this.mapCfg, this.dialog, this.zone, this.data, this.mapSvc)
      this.measureXY.enable()
      this.measureXY.onDisable(() => {
        this.map.dragging.enable()
        this.map.doubleClickZoom.enable()
        this.measureXY = undefined
      })
    }
  }
}
