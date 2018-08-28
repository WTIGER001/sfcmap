import { Component, OnInit, Output, EventEmitter, Input, AfterContentInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { RouteUtil } from '../../util/route-util';

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

  constructor(private data: DataService, private router : Router) { }

  ngAfterContentInit() {
    this.disabled = !this.data.canEdit(this.item)
    console.log("EDIT DISABLED", this.disabled, this.item);
  }

  save() {
    this.onSave.emit()
    RouteUtil.goUpTwoLevels(this.router)
  }
}
