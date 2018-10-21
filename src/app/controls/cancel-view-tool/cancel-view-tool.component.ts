import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUtil } from '../../util/route-util';

@Component({
  selector: 'app-cancel-view-tool',
  templateUrl: './cancel-view-tool.component.html',
  styleUrls: ['./cancel-view-tool.component.css']
})
export class CancelViewToolComponent implements OnInit {
  @Input() type: 'view' | 'edit'|'none'= 'none'
  @Output() onClick = new EventEmitter()
  
  constructor(private router: Router) { }

  ngOnInit() {
  }

  backUrl(): string[] {
    if (this.type == 'view') {
      return RouteUtil.upOneLevel(this.router)
    } else if (this.type == 'edit') {
      return RouteUtil.upTwoLevels(this.router)
    }
  }

  click() {
    console.log("Cancel Event")
    this.onClick.emit()
  }
}
