import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TokenAnnotation, Character } from 'src/app/models';

@Component({
  selector: 'app-vision-view',
  templateUrl: './vision-view.component.html',
  styleUrls: ['./vision-view.component.css']
})
export class VisionViewComponent implements OnInit {

  @Input() item: TokenAnnotation
  @Output() changes = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  update() {
    this.changes.emit()
  }
}
