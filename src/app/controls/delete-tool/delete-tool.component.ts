import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import { RouteUtil } from '../../util/route-util';
import { CommonDialogService } from '../../dialogs/common-dialog.service';

@Component({
  selector: 'app-delete-tool',
  templateUrl: './delete-tool.component.html',
  styleUrls: ['./delete-tool.component.css']
})
export class DeleteToolComponent implements OnInit, AfterContentInit {
  @Input() mode: 'tool' | 'button-text' | 'button' = 'tool'
  @Input() item: any
  @Input() type: 'edit' | 'view'
  disabled = false
  linked = false

  constructor(private data: DataService, private router: Router, private cd: CommonDialogService) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.disabled = !this.data.canEdit(this.item)
    this.linked = this.data.isLinked(this.item)
    console.log("DELETE DISABLED", this.disabled);

  }


  unlink() {
    if (!this.disabled) {
      this.cd.confirm("Are you sure you want to unlink " + this.item.name + "? ", "Confirm Unlink").subscribe(
        r => {
          if (r) {
            this.data.unlink(this.item)
            // this.data.delete(this.item)
            if (this.type == 'view') {
              RouteUtil.goUpOneLevel(this.router)
            } else if (this.type == 'edit') {
              RouteUtil.goUpTwoLevels(this.router)
            }
          }
        }
      )
    }
  }

  delete() {
    if (!this.disabled) {
      this.cd.confirm("Are you sure you want to delete " + this.item.name + "? ", "Confirm Delete").subscribe(
        r => {
          if (r) {
            this.data.delete(this.item)
            if (this.type == 'view') {
              RouteUtil.goUpOneLevel(this.router)
            } else if (this.type == 'edit') {
              RouteUtil.goUpTwoLevels(this.router)
            }
          }
        }
      )
    }
  }
}
