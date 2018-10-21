import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShapeAnnotation } from 'src/app/models';

@Component({
  selector: 'app-shape-selection',
  templateUrl: './shape-selection.component.html',
  styleUrls: ['./shape-selection.component.css']
})
export class ShapeSelectionComponent implements OnInit {
  @Input() item : ShapeAnnotation
  @Output() onPan = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  panTo() {
    this.onPan.emit()
  }
}
