import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { DataService } from '../../data.service';
import { RestrictService } from '../../dialogs/restrict.service';

@Component({
  selector: 'app-restrict-tool',
  templateUrl: './restrict-tool.component.html',
  styleUrls: ['./restrict-tool.component.css']
})
export class RestrictToolComponent implements AfterContentInit {
  @Input() style = 'li'
  @Input() item
  @Input() saveOnChange = true

  private restricted = false

  constructor(private data: DataService, private restrict: RestrictService) { }

  ngAfterContentInit() {
    this.restricted = this.data.isRestricted(this.item)
  }

  permissions() {
    if (this.item) {
      this.restrict.openRestrict(this.item.view, this.item.edit).subscribe(([view, edit]) => {
        if (this.data.canEdit(this.item)) {
          this.item.edit = edit
          this.item.view = view
          this.data.save(this.item)
          this.restricted = this.data.isRestricted(this.item)
        }
      })
    }
  }

}