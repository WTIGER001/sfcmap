import { Component, OnInit } from '@angular/core';
import { MarkerService, MyMarker } from '../marker.service';
import { MapService } from '../map.service';

@Component({
  selector: 'app-marker-side',
  templateUrl: './marker-side.component.html',
  styleUrls: ['./marker-side.component.css']
})
export class MarkerSideComponent implements OnInit {
  marker: MyMarker
  edit = false
  constructor(private mks: MarkerService, private mapSvc: MapService) {
    this.mks.selection.subscribe(m => {
      this.marker = this.mks.toMyMarker(m);
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

    this.edit = true
  }

  iconImg() {
    if (this.marker !== undefined) {
      return this.marker.marker
    }
  }

  public editstart() {
    this.edit = true
  }

  public cancel() {
    this.edit = false
  }

  public save() {
    this.edit = false
  }
}
