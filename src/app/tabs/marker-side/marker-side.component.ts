import { Component, OnInit } from '@angular/core';
import { MarkerService, MyMarker } from '../../marker.service';
import { MapService } from '../../map.service';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { MarkerType, MapConfig, MarkerGroup } from '../../models';
import { RestrictService } from '../../dialogs/restrict.service';
import { DataService } from '../../data.service';
import { mergeMap } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';

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
  constructor(private mks: MarkerService, private mapSvc: MapService, private CDialog: CommonDialogService, private restrict: RestrictService, private data: DataService) {
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
          return this.data.getMarkerGroups(m.id)
        })
      )
      .subscribe(v => {
        this.groups = v
      })

    this.mks.catsLoaded.subscribe(v => {
      this.categories = this.mks.categories
    })
    this.mapSvc.markerReady.subscribe(marker => {
      console.log("Received Add");
      this.ready.set(marker.id, true)
    })
    this.mapSvc.markerRemove.subscribe(marker => {
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
    this.restricted = false
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

    // console.log('--------ONCE-------');

    // let newGroup = new MarkerGroup()
    // newGroup.id = UUID.UUID().toString()
    // newGroup.name = "Sample Group"
    // newGroup.map = this.map.id
    // this.marker.markerGroup = newGroup.id
    // console.log(newGroup);

    // this.data.save(newGroup)

    console.log(this.marker);

    this.mks.saveMarker(this.marker)
    this.mapSvc.newmarkerLayer.clearLayers()
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

  public permissions() {
    if (this.marker) {
      this.restrict.openRestrict(this.marker.view, this.marker.edit).subscribe(([view, edit]) => {
        if (this.data.canEdit(this.marker)) {
          console.log("edit " + edit);
          console.log("view " + view);

          this.marker.edit = edit
          this.marker.view = view
          this.mks.saveMarker(this.marker)
        }
      })
    }
  }
}


