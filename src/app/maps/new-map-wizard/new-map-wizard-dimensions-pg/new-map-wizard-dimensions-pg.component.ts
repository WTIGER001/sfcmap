import { Component, OnInit, Input } from '@angular/core';
import { MapConfig } from 'src/app/models';
import { DistanceUnit } from 'src/app/util/transformation';
import { GridOptions } from 'src/app/leaflet/grid';

@Component({
  selector: 'app-new-map-wizard-dimensions-pg',
  templateUrl: './new-map-wizard-dimensions-pg.component.html',
  styleUrls: ['./new-map-wizard-dimensions-pg.component.css']
})
export class NewMapWizardDimensionsPgComponent implements OnInit {
  @Input() map: MapConfig
  units = DistanceUnit.units
  gridunit = 'ft'
  gridvalue = 5
  bgcolor = "#000000"
  hGrid = 10
  wGrid = 10

  constructor() { }

  ngOnInit() {
    this.update()
  }

  height() {
    return (this.gridvalue * this.hGrid) + " " + this.gridunit
  }

  width() {
    return (this.gridvalue * this.wGrid) + " " + this.gridunit
  }

  update() {
    const unit = DistanceUnit.getUnit(this.gridunit)
    this.map.height = unit.toMeters(this.gridvalue * this.hGrid)
    this.map.width = unit.toMeters(this.gridvalue * this.hGrid)
    const gridOpts = new GridOptions()
    gridOpts.spacing = this.gridvalue
    gridOpts.spacingUnit = this.gridunit
    this.map.gridOptions = gridOpts
  }
}
