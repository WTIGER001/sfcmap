import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MarkerTypeAnnotation, MapConfig, MergedMapType } from '../../models';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-edit-marker',
  templateUrl: './edit-marker.component.html',
  styleUrls: ['./edit-marker.component.css']
})
export class EditMarkerComponent {
  @Input()
  map: MapConfig

  @Input()
  marker: MarkerTypeAnnotation

  @Output() changes = new EventEmitter<MarkerTypeAnnotation>()

  merged: MergedMapType[] = []

  constructor(private data: DataService) {
    this.data.mapTypesWithMaps.subscribe(items => {
      this.merged = items
    })
  }

  save() {

  }

  update() {
    this.marker.copyOptionsToShape();
  }
}
