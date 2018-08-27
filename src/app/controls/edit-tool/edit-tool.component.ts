import { Component, OnInit, Output, EventEmitter, Input, AfterContentInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-edit-tool',
  templateUrl: './edit-tool.component.html',
  styleUrls: ['./edit-tool.component.css']
})
export class EditToolComponent implements AfterContentInit {
  @Input() item
  @Output() onSave = new EventEmitter
  @Input() mode: 'save' | 'edit' = 'edit'
  disabled = false

  constructor(private data: DataService) { }

  ngAfterContentInit() {
    this.disabled = !this.data.canEdit(this.item)
    console.log("EDIT DISABLED", this.disabled, this.item);
  }

  save() {
    this.onSave.emit()
  }
}
