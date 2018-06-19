import { Component, OnInit } from '@angular/core';
import { MarkerService, MyMarker } from '../marker.service';
import { MapService } from '../map.service';
import { CommonDialogService } from '../dialogs/common-dialog.service';

@Component({
  selector: 'app-marker-side',
  templateUrl: './marker-side.component.html',
  styleUrls: ['./marker-side.component.css']
})
export class MarkerSideComponent implements OnInit {
  marker: MyMarker
  edit = false
  constructor(private mks: MarkerService, private mapSvc: MapService, private CDialog: CommonDialogService) {
    this.mks.selection.subscribe(m => {
      if (this.marker != undefined) {
        this.marker.m.dragging.disable()
      }
      this.marker = this.mks.toMyMarker(m);
      this.edit = false
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
    this.marker = this.mks.newMarker()
    console.log(this.marker);

    this.editstart()
  }

  iconImg() {
    if (this.marker !== undefined) {
      return this.marker.marker
    }
  }

  public editstart() {
    if (this.marker !== undefined) {
      this.edit = true
      this.marker.m.dragging.enable()
    }
  }

  public cancel() {
    this.edit = false
    this.marker.m.dragging.disable()
  }

  public save() {
    this.edit = false
    this.marker.m.dragging.disable()
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
}
