import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractValueAccessor } from '../value-accessor';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: CheckboxComponent, multi: true }
  ]
})
export class CheckboxComponent extends AbstractValueAccessor {
  id = UUID.UUID().toString()
  internalchecked = false
  @ViewChild('checkel') checkel

  @Output() checkchange = new EventEmitter()

  @Input() set checked(v: boolean) {
    this.value = v
    this.internalchecked = v
  }

  get checked(): boolean {
    return this.internalchecked
  }

  constructor() {
    super()
  }

  ngOnInit() {
  }

  changeEvent() {
    console.log("CHECKING ");
    this.value = this.internalchecked
    this.checkchange.emit(this.value)
  }

  refresh() {
    this.internalchecked = this.value
  }

}
