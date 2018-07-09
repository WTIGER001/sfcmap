import { Component, OnInit, NgZone } from '@angular/core';
import { MapService, MyMarker } from '../../map.service';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { MarkerType, MapConfig, MarkerGroup, MergedMapType } from '../../models';
import { RestrictService } from '../../dialogs/restrict.service';
import { DataService } from '../../data.service';
import { mergeMap } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import { Map as LeafletMap, LeafletMouseEvent } from 'leaflet';
import { CalibrateX } from '../../leaflet/calibrate';
import { DialogService } from '../../dialogs/dialog.service';
import { Measure } from '../../leaflet/measure';

@Component({
  selector: 'app-marker-side',
  templateUrl: './marker-side.component.html',
  styleUrls: ['./marker-side.component.css']
})
export class MarkerSideComponent implements OnInit {
  marker: MyMarker
  edit = false
  map: MapConfig
  categories = []
  groups: MarkerGroup[] = []
  ready = new Map<string, boolean>()
  restricted = false
  merged: MergedMapType[] = []
  leafletMap: LeafletMap
  ruler: number[] = [4]

  calibrateX: CalibrateX

  constructor(private mapSvc: MapService, private CDialog: CommonDialogService, private restrict: RestrictService, private data: DataService, private dialog: DialogService, private zone: NgZone) {
    this.data.mapTypesWithMaps.subscribe(items => {
      this.merged = items
    })
    this.mapSvc.map.subscribe(m => {
      this.leafletMap = m
    })

    // Handle Selections
    this.mapSvc.selection.subscribe(sel => {
      if (this.marker != undefined) {
        this.disable()
      }
      if (!sel.isEmpty()) {
        if (MyMarker.is(sel.first)) {
          this.restricted = this.data.isRestricted(sel.first)
          this.marker = sel.first
          this.edit = false
        }
      }
    })
    // Get Data
    this.mapSvc.mapConfig
      .pipe(
        mergeMap(m => {
          this.map = m;
          return this.data.getCompleteMarkerGroups(m.id)
        })
      )
      .subscribe(v => {
        this.groups = v
      })

    this.data.categories.subscribe(categories => {
      this.categories = categories
    })
  }

  pan() {
    if (this.marker !== undefined) {
      this.mapSvc.panTo(this.marker.marker["_latlng"])
    }
  }

  startRuler() {
    this.leafletMap.dragging.disable()
    this.leafletMap.doubleClickZoom.disable()
    this.calibrateX = new CalibrateX(this.leafletMap, this.map, this.dialog, this.zone, this.data, this.mapSvc)
    this.calibrateX.enable()
    this.calibrateX.onDisable(() => {
      this.leafletMap.dragging.enable()
      this.leafletMap.doubleClickZoom.enable()
    })
  }

  startMeasure() {
    this.leafletMap.dragging.disable()
    this.leafletMap.doubleClickZoom.disable()
    let measure = new Measure(this.leafletMap, this.map, this.dialog, this.zone, this.data, this.mapSvc)
    measure.enable()
    measure.onDisable(() => {
      this.leafletMap.dragging.enable()
      this.leafletMap.doubleClickZoom.enable()
    })
  }

  private isMouseEvent(event: any): event is LeafletMouseEvent {
    return true
  }

  ngOnInit() {
  }

  public newMarker() {
    let m = this.mapSvc.newTempMarker()
    this.mapSvc.addTempMarker(m)
    this.marker = m
    this.restricted = false
    this.editstart()
  }


  name(): string {
    let mk = this.mapSvc.getMarkerType(this.marker.type)
    if (mk) {
      return mk.name
    }
    return 'Ugh....'
  }

  mapId() {
    return this.map.id
  }

  iconImg() {
    if (this.marker !== undefined) {
      return this.marker.marker
    }
  }

  public editstart() {
    if (this.marker !== undefined) {
      this.edit = true
      this.enable()
    }
  }

  public cancel() {
    this.edit = false
    this.disable()
  }

  public save() {
    this.edit = false
    this.disable()
    console.log('--------SAVING-------');
    console.log('Marker Group = ' + this.marker.markerGroup)
    // Determine if a new Marker group was used
    if (this.marker.markerGroup) {
      let type = this.groups.find(mg => mg.id == this.marker.markerGroup)
      console.log(type);

      if (type == undefined) {
        console.log('--------NOT FOUND-------');
        let newGroup = new MarkerGroup()
        newGroup.id = UUID.UUID().toString()
        newGroup.name = this.marker.markerGroup
        newGroup.map = this.map.id
        this.marker.markerGroup = newGroup.id
        console.log(newGroup);
        this.data.save(newGroup)
      }
    }
    console.log(this.marker);

    this.mapSvc.saveMarker(this.marker)
    this.mapSvc.newMarkersLayer.clearLayers()
  }

  public delete() {
    if (this.marker != undefined) {
      this.CDialog.confirm("Are you sure you want to delete this marker?", "Delete " + this.marker.name + "?").subscribe(result => {
        if (result) {
          this.mapSvc.deleteMarker(this.marker)
          this.edit = false
          this.marker = undefined
        }
      })
    }
  }
  enable() {
    if (this.marker && this.marker.m.dragging) {
      this.marker.m.dragging.enable()
    }
  }
  disable() {
    if (this.marker && this.marker.m.dragging) {
      this.marker.m.dragging.disable()
    }
  }

  setType(t: MarkerType) {
    this.marker.type = t.id
    let icn = this.mapSvc.getIcon(t.id)
    this.marker.marker.setIcon(icn)
  }

  public openLinkedMap() {
    if (this.marker && this.marker.mapLink) {
      this.mapSvc.openMap(this.marker.mapLink)
    }
  }

  public permissions() {
    if (this.marker) {
      this.restrict.openRestrict(this.marker.view, this.marker.edit).subscribe(([view, edit]) => {
        if (this.data.canEdit(this.marker)) {
          console.log("edit " + edit);
          console.log("view " + view);

          this.marker.edit = edit
          this.marker.view = view
          this.mapSvc.saveMarker(this.marker)
        }
      })
    }
  }
}


