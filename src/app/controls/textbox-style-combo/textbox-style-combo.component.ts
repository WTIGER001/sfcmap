import { Component, OnInit, Input, Output } from '@angular/core';
import { AbstractValueAccessor } from '../value-accessor';
import { EventEmitter } from 'events';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textbox-style-combo',
  templateUrl: './textbox-style-combo.component.html',
  styleUrls: ['./textbox-style-combo.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: TextboxStyleComboComponent, multi: true }
  ]
})
export class TextboxStyleComboComponent extends AbstractValueAccessor {
  text = "Label Style"
  selected: string
  styles = [
    "sfc-tooltip-default",
    "sfc-tooltip-background",
    "sfc-tooltip-default-lg",
    "sfc-tooltip-background-lg",
    "sfc-tooltip-default-sm",
    "sfc-tooltip-background-sm",
  ]

  @Output() change = new EventEmitter()

  constructor() {
    super()
  }

  ngAfterViewInit() {
    this.refresh()
  }

  select(item: string) {
    console.log("Selecting ", item);
    this.selected = item
    this.value = item
    this.change.emit(this.selected)
  }

  refresh() {
    let v = this.value
    this.selected = v
  }

}
