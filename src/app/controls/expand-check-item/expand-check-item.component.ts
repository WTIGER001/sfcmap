import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-expand-check-item',
  templateUrl: './expand-check-item.component.html',
  styleUrls: ['./expand-check-item.component.css']
})
export class ExpandCheckItemComponent {

  @Input() collapsed: boolean = true
  @Input() checkable: boolean = true
  @Input() checked: boolean = false
  @Output() checkStateChanged = new EventEmitter<boolean>()

  constructor() { }

  ngOnInit() {
  }

}
