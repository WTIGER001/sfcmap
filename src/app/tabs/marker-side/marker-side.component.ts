import { Component, OnInit } from '@angular/core';
import { MarkerService, MyMarker } from '../../marker.service';
import { MapService } from '../../map.service';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { MarkerType, MapConfig } from '../../models';

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
  ready = new Map<string, boolean>()
  constructor(private mks: MarkerService, private mapSvc: MapService, private CDialog: CommonDialogService) {
    // Handle Selections
    this.mapSvc.selection.subscribe(sel => {
      if (this.marker != undefined) {
        this.disable()
      }
      if (!sel.isEmpty()) {
        if (MyMarker.is(sel.first)) {
          this.marker = sel.first
          this.edit = false
        }
      }
    })
    // Get Data
    this.mapSvc.mapConfig.subscribe(m => this.map = m)
    this.mks.catsLoaded.subscribe(v => {
      this.categories = this.mks.categories
    })
    this.mapSvc.markerReady.subscribe( marker => {
      console.log("Received Add");
      this.ready.set(marker.id, true)
    })
    this.mapSvc.markerRemove.subscribe( marker => {
      console.log("Received Remove");
      this.ready.delete(marker.id)
    })
  }

  pan() {
    if (this.marker !== undefined) {
      this.mapSvc.panTo(this.marker.marker["_latlng"])
    }
  }

  ngOnInit() {
  }

  public newMarker() {
    // this.mks.newMarker(true)
    // console.log(this.marker);
    let m = this.mks.newTempMarker()
    this.mapSvc.addTempMarker(m)
    this.marker = m
    this.editstart()
  }


  name(): string {
    let mk = this.mks.getMarkerType(this.marker.type)
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
    this.mks.saveMarker(this.marker)
  }

  public delete() {
    if (this.marker != undefined) {
      this.CDialog.confirm("Are you sure you want to delete this marker?", "Delete " + this.marker.name + "?").subscribe(result => {
        if (result) {
          this.mks.deleteMarker(this.marker)
          this.edit = false
          this.marker = undefined
        }
      })
    }
  }
  enable() {
    if (this.marker && this.marker.m.dragging) {
      this.marker.m.dragging.enable()
    } else {
     
    }
  }
  disable() {
    if (this.marker && this.marker.m.dragging) {
      this.marker.m.dragging.disable()
    }
  }
  
  setType(t: MarkerType) {
    this.marker.type = t.id
    let icn = this.mks.markerTypes.get(t.id)
    this.marker.marker.setIcon(icn)
  }
}


