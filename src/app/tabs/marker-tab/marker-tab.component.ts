import { Component, OnInit, NgZone } from '@angular/core';
import { MapService, MyMarker } from '../../map.service';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { MarkerType, MapConfig, MarkerGroup, MergedMapType, Selection } from '../../models';
import { RestrictService } from '../../dialogs/restrict.service';
import { DataService } from '../../data.service';
import { mergeMap } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import { Map as LeafletMap, LeafletMouseEvent, Util } from 'leaflet';
import { CalibrateX } from '../../leaflet/calibrate';
import { DialogService } from '../../dialogs/dialog.service';
import { Measure } from '../../leaflet/measure';
import { Format } from '../../util/format';

@Component({
  selector: 'app-marker-tab',
  templateUrl: './marker-tab.component.html',
  styleUrls: ['./marker-tab.component.css']
})
export class MarkerTabComponent implements OnInit {
  marker: MyMarker
  markers: MyMarker

  edit = false
  map: MapConfig
  categories = []
  groups: MarkerGroup[] = []
  ready = new Map<string, boolean>()
  restricted = false
  merged: MergedMapType[] = []
  leafletMap: LeafletMap
  ruler: number[] = [4]
  selection: Selection = new Selection([])
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
      this.processSelection(sel)
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


  private isMouseEvent(event: any): event is LeafletMouseEvent {
    return true
  }

  ngOnInit() {
  }

  public newMarker() {
    let m = this.mapSvc.newTempMarker()
    this.mapSvc.addTempMarker(m)
    this.processSelection(new Selection([m]))
    this.restricted = false
    this.editstart()
  }

  name(m: MyMarker): string {
    let mk = this.groups.find(grp => grp.id == m.markerGroup)
    if (mk) {
      return mk.name
    }
    return 'Ugh....'
  }

  coords(m: MyMarker): string {
    let ll = m.m.getLatLng()
    return ll.lng.toFixed(1) + ", " + ll.lat.toFixed(1)
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
      this.enableDragging()
    }
  }

  public cancel() {
    this.edit = false
    this.disableDragging()
    this.mapSvc.newMarkersLayer.clearLayers()

    if (this.marker.id == "TEMP") {
      this.processSelection(new Selection([]))
    }
  }

  public save() {
    this.edit = false
    this.disableDragging()

    if (this.selection.items.length > 1) {
      // Find and create the markergroup if needed
      let typeId = this.getGroupOrCreateId(this.markers.markerGroup)

      // Apply the changes to each
      this.selection.items.forEach(m => {
        if (MyMarker.is(m)) {
          if (m.markerGroup != typeId || m.type != this.markers.type) {
            m.markerGroup = typeId
            m.type = this.markers.type
          }
          this.mapSvc.saveMarker(m)
        }
      })
    } else {
      let typeId = this.getGroupOrCreateId(this.marker.markerGroup)
      this.marker.markerGroup = typeId
      this.mapSvc.saveMarker(this.marker)
    }

    this.mapSvc.newMarkersLayer.clearLayers()
  }

  getGroupOrCreateId(markerGroupIdOrName: string) {
    let typeId = ''
    if (markerGroupIdOrName) {
      let type = this.groups.find(mg => mg.id == markerGroupIdOrName)
      if (type == undefined) {
        type = new MarkerGroup()
        type.id = UUID.UUID().toString()
        type.name = markerGroupIdOrName
        type.map = this.map.id
        this.data.save(type)
      }
      typeId = type.id
    }
    return typeId
  }

  public delete() {
    if (this.marker != undefined) {
      let names = []
      this.selection.items.forEach(m => {
        if (MyMarker.is(m)) {
          names.push(m.name)
        }
      })
      let namesTxt = Format.formatArray(names)
      console.log("NAMES: ", names, namesTxt, this.selection.items);

      this.CDialog.confirm("Are you sure you want to delete " + namesTxt + "?", "Confirm Delete").subscribe(result => {
        if (result) {
          this.selection.items.forEach(m => {
            if (MyMarker.is(m)) {
              this.mapSvc.deleteMarker(m)
            }
          })
          this.edit = false
          this.mapSvc.newMarkersLayer.clearLayers()
          this.processSelection(new Selection([]))
        }
      })
    }
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
          this.selection.items.forEach(m => {
            if (MyMarker.is(m)) {
              this.marker.edit = edit
              this.marker.view = view
              this.mapSvc.saveMarker(this.marker)
            }
          })
        }
      })
    }
  }

  private processSelection(newSelection: Selection) {
    this.disableDragging()
    this.selection = newSelection
    this.restricted = this.isRestricted()
    this.marker = this.firstMarker()
    if (this.marker) {
      this.markers = new MyMarker(this.marker.m)
    }
    this.edit = false
  }

  private firstMarker(): MyMarker {
    return this.selection.items.find(m => MyMarker.is(m))
  }

  private isRestricted(): boolean {
    let r = false
    this.selection.items.forEach(m => {
      r = r || this.data.isRestricted(m)
    })
    return r
  }

  private disableDragging() {
    this.selection.items.forEach(m => {
      if (MyMarker.is(m) && m.m && m.m.dragging) {
        m.m.dragging.disable()
      }
    })
  }

  private enableDragging() {
    this.selection.items.forEach(m => {
      console.log("ENABLE DRAGGING: ", m);
      if (MyMarker.is(m) && m.m && m.m.dragging) {
        console.log("ENABLE DRAGGING2: ", m);
        m.m.dragging.enable()
      }
    })
  }

  public updateMuliEdit() {

  }
}


