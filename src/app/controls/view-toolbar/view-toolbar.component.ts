import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-view-toolbar',
  templateUrl: './view-toolbar.component.html',
  styleUrls: ['./view-toolbar.component.css']
})
export class ViewToolbarComponent implements OnInit {
  @Input() item
  @Input() light = false
  @Output() onCancel = new EventEmitter()
  constructor() { }

  ngOnInit() {
  }

  cancel() {
    this.onCancel.emit()
  }
}
