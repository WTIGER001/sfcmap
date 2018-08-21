import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import { RouteUtil } from '../../util/route-util';
import { CommonDialogService } from '../../dialogs/common-dialog.service';

@Component({
  selector: 'app-delete-tool',
  templateUrl: './delete-tool.component.html',
  styleUrls: ['./delete-tool.component.css']
})
export class DeleteToolComponent implements OnInit {
  @Input() item: any
  @Input() type: 'edit' | 'view'

  constructor(private data: DataService, private router: Router, private cd: CommonDialogService) { }

  ngOnInit() {
  }

  delete() {
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
