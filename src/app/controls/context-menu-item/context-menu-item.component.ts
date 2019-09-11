import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClickType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-context-menu-item',
  templateUrl: './context-menu-item.component.html',
  styleUrls: ['./context-menu-item.component.css']
})
export class ContextMenuItemComponent implements OnInit {
  @Input() icon: string
  @Input() iconType: string
  @Input() text: string
  @Output() clicked: EventEmitter<any>
  @Input() children: ContextMenuItemComponent[]

  constructor() { }

  ngOnInit() {
  }

}
