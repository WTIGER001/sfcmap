import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BarrierAnnotation } from 'src/app/models';

@Component({
  selector: 'app-barrier-selection',
  templateUrl: './barrier-selection.component.html',
  styleUrls: ['./barrier-selection.component.css']
})
export class BarrierSelectionComponent implements OnInit {
  @Input() item : BarrierAnnotation
  @Output() onPan = new EventEmitter()
  constructor() { }

  ngOnInit() {
  }


  panTo() {
    this.onPan.emit()
  }
}
