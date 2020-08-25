import { Component, OnInit, Input, NgZone } from '@angular/core';
import { MapConfig } from 'src/app/models';
import { UpdateItemCmd } from 'od-virtualscroll';
import { DistanceUnit, Trans } from 'src/app/util/transformation';
import { MapOptions, Map, imageOverlay, latLngBounds, Layer, Transformation, ImageOverlay, control } from 'leaflet';
import { Scale } from 'src/app/leaflet/scale';
import { ZoomControls } from 'src/app/leaflet/zoom-controls';
import { Rect } from 'src/app/util/geom';
import { CalibrateX } from 'src/app/leaflet/calibrate';
import { CommonDialogService } from 'src/app/dialogs/common-dialog.service';
import { DialogService } from 'src/app/dialogs/dialog.service';

@Component({
  selector: 'app-new-map-wizard-calibrate-pg',
  templateUrl: './new-map-wizard-calibrate-pg.component.html',
  styleUrls: ['./new-map-wizard-calibrate-pg.component.css']
})
export class NewMapWizardCalibratePgComponent implements OnInit {
  @Input() map : MapConfig
  pHeight : number
  pWidth : number
  pUnit : string = 'ft'
  
  crs = Trans.createManualCRS(1)
  bounds = latLngBounds([[0, 0], [50, 100]])
  overlayLayer : ImageOverlay
  units = DistanceUnit.units
  leafletMap : Map

  scale: Scale
  calibrate : CalibrateX
  zoom : ZoomControls


  layers: Layer[] = []
  options = {
    zoom: 1,
    minZoom: -5,
    continousWorld: false,
    crs: this.crs,
    attributionControl: false,
    zoomDelta: 0.5,
    editable: true,
    divisions: 4,
    zoomControl: false,
    doubleClickZoom: false,
    keyboard: false
  }

  constructor(private zone : NgZone, private dialog: DialogService) { }

  ngOnInit() {
    console.log("ngOnInit", this.map)
    if (this.map.image) {
      this.updatePPM()
    }
  }

  onMapReady( map : Map) {
    console.log("MAP READY", this.map)
    this.leafletMap = map
    // map.setMaxBounds(Rect.multiply(this.bounds, 2));
    map.setMaxBounds(this.bounds);
    map.fitBounds(this.bounds)
    map.createPane("base").style.zIndex = "201"

    this.scale = new Scale({offset: false})
    this.scale.show(map, true)

    this.calibrate = new CalibrateX(map, this.map, this.dialog, this.zone, undefined, undefined)
    this.calibrate.changes.subscribe( newPPM => {
      this.updatePPM()
    })

    this.zoom = new ZoomControls(undefined, {
      position: 'topleft'
    }, this.map, this.overlayLayer).addTo(map)

    map.addControl(
     control.attribution({
        position: 'bottomright',
        prefix: ''
      })
    );
  }

  updatePPM() {
    const unit = DistanceUnit.getUnit(this.pUnit) || DistanceUnit.M
    this.pHeight = unit.fromMeters( this.map.height / this.map.ppm)
    this.pWidth = unit.fromMeters(this.map.width / this.map.ppm)
    this.updateMap()
  }

  updatePDimH() {
    const unit = DistanceUnit.getUnit(this.pUnit) || DistanceUnit.M
    this.map.ppm = this.map.height / unit.toMeters(this.pHeight) 
    this.pWidth = unit.fromMeters(this.map.width / this.map.ppm)
    this.updateMap()
  }

  updatePDimW() {
    const unit = DistanceUnit.getUnit(this.pUnit) || DistanceUnit.M
    this.map.ppm = this.map.width / unit.toMeters(this.pWidth)
    this.pHeight = unit.fromMeters(this.map.height / this.map.ppm)
    this.updateMap()
  }

  updateUnit() {
    const unit = DistanceUnit.getUnit(this.pUnit) || DistanceUnit.M
    this.pWidth = unit.fromMeters(this.map.width / this.map.ppm)
    this.pHeight = unit.fromMeters(this.map.height / this.map.ppm)
  }

  updateMap() {
    let factor = Trans.computeFactor(this.map)
    let transformation = Trans.createTransform(this.map)
    this.bounds = latLngBounds([[0, 0], [this.map.height / factor, this.map.width / factor]]);

    this.overlayLayer = imageOverlay(this.map.image, this.bounds, { pane: 'base', attribution: this.map.attribution })
    this.crs.transformation = new Transformation(factor, 0, -factor, 0)

    this.layers.splice(0, this.layers.length)
    this.layers.push(this.overlayLayer)

    if (this.leafletMap) {
      // this.leafletMap.setMaxBounds(Rect.multiply(this.bounds, 2));
      this.leafletMap.setMaxBounds(this.bounds);
      this.leafletMap.fitBounds(this.bounds)
      this.zoom.update(this.overlayLayer)
    }
  }

  toggleCalibrate() {
    if (this.calibrate.enabled()) {
      this.calibrate.disable()
    } else {
      this.calibrate.enable()
    }
  }

  canNext() : boolean {
    return this.map.ppm != 0 && this.map.height > 0 && this.map.width > 0
  }

}
