import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { MapService } from '../../maps/map.service';
import { DataService } from '../../data.service';
import { MapConfig, Distance } from '../../models';
import { Map as LeafletMap, GridLayerOptions, Util } from 'leaflet';
import { CalibrateX } from '../../leaflet/calibrate';
import { DialogService } from '../../dialogs/dialog.service';
import { Measure } from '../../leaflet/measure';
import { Rgba } from 'ngx-color-picker';
import { DistanceUnit } from '../../util/transformation';
import { GridLayer, GridOptions } from '../../leaflet/grid';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { EditMapComponent } from '../../controls/edit-map/edit-map.component';

@Component({
  selector: 'app-map-tab',
  templateUrl: './map-tab.component.html',
  styleUrls: ['./map-tab.component.css']
})
export class MapTabComponent implements OnInit {
  @ViewChild('editmap') editmap: EditMapComponent

  mapCfg: MapConfig
  map: LeafletMap

  calibrateX: CalibrateX
  measureXY: Measure
  units = DistanceUnit.units
  edit = false

  grid: GridLayer
  isCollapsed = {}
  saveMe = new Subject<boolean>()
  link = []
  constructor(private mapSvc: MapService, private data: DataService, private dialog: DialogService, private zone: NgZone, private commonDialog: CommonDialogService) {
    this.isCollapsed['grid'] = true
    this.isCollapsed['fog'] = true
    this.grid = new GridLayer(this.mapSvc)
    this.mapSvc.mapConfig.subscribe(m => {
      if (m.id == 'Bad') {
        this.mapCfg = undefined
      } else if (m.id == 'TEMP') {
        this.mapCfg = m
        this.edit = true
        this.grid.remove()
      } else {
        this.mapCfg = m
        this.edit = false
        this.grid.remove()
        this.grid = new GridLayer(this.mapSvc)
        if (m.gridOptions) {
          Util.extend(this.grid.options, m.gridOptions)
        }
        if (this.grid.options.enabled && this.map) {
          this.grid.addTo(this.map)
        }
      }
      this.link = ['/game', this.mapCfg.owner, 'maps', this.mapCfg.id, 'edit']
    })
    this.mapSvc.map.subscribe(m => this.map = m)
    this.saveMe.pipe(throttleTime(2000)).subscribe(b => {
      this.data.saveMap(this.mapCfg)
    })
  }

  ngOnInit() {
  }

  addMarker() {

  }

  getLink() {
    return this.link;
  }

  public startEdit() {
    this.edit = true
  }

  public close() {
    // this.mapSvc.setConfig(null)
    this.mapSvc.closeMap()
  }

  public delete() {
    this.commonDialog.confirm("Are you sure you want to delete this map? This cannot be undone. All the markers and content assocaited with this map will also be deleted.", "Delete " + this.mapCfg.name)
      .subscribe(result => {
        if (result) {
          this.data.deleteMap(this.mapCfg)
          this.mapCfg = undefined
          this.mapSvc.closeMap()
        }
      })
  }


  save() {
    this.edit = false
    this.editmap.save()
    this.mapCfg = this.editmap.selected
  }

  cancel() {
    this.edit = false
  }

  public toggleGrid() {
    if (this.grid.options.enabled) {
      this.grid.addTo(this.map)
    } else {
      this.grid.remove()
    }
    this.mapCfg.gridOptions = this.grid.options
    this.data.saveMap(this.mapCfg)
  }

  public updateGrid() {
    if (this.grid.options.enabled) {
      this.grid.refresh()
    }
    this.mapCfg.gridOptions = this.grid.options
    this.saveMe.next(true)
  }

  calibrate() {
    if (this.measureXY) {
      this.measureXY.disable()
    }

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
    if (this.calibrateX) {
      this.calibrateX.disable()
    }

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
