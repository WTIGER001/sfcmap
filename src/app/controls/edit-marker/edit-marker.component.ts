import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MarkerTypeAnnotation, MapConfig } from '../../models';

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

  constructor() { }

  save() {

  }

}
