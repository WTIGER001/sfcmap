import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-toolbar',
  templateUrl: './edit-toolbar.component.html',
  styleUrls: ['./edit-toolbar.component.css']
})
export class EditToolbarComponent implements OnInit {
  @Input() item
  @Input() mode: 'icon' | 'icon-text' | 'button' | 'button-text'
  @Output() onSave = new EventEmitter()
  @Output() onCancel = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  save() {
    this.onSave.emit()
  }
  cancel() {
    console.log("Cancel Event")
    this.onCancel.emit()
  }
}
