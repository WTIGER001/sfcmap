import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { MarkerTypeAnnotation } from 'src/app/models';

@Component({
  selector: 'app-marker-selection',
  templateUrl: './marker-selection.component.html',
  styleUrls: ['./marker-selection.component.css']
})
export class MarkerSelectionComponent implements OnInit {
  @Input() item: MarkerTypeAnnotation
  @Output() onPan = new EventEmitter()
  
  constructor() { }

  ngOnInit() {
  }

  panTo() {
    this.onPan.emit()
  }
}
