import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ImageAnnotation } from 'src/app/models';

@Component({
  selector: 'app-image-selection',
  templateUrl: './image-selection.component.html',
  styleUrls: ['./image-selection.component.css']
})
export class ImageSelectionComponent implements OnInit {

  @Input() item: ImageAnnotation
  @Output() onPan = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  panTo() {
    this.onPan.emit()
  }
}
