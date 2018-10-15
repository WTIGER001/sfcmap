import { Component, OnInit, Output, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DistanceUnit } from 'src/app/util/transformation';
import { AbstractValueAccessor } from '../value-accessor';
import { Distance } from 'src/app/models';

@Component({
  selector: 'app-input-distance',
  templateUrl: './input-distance.component.html',
  styleUrls: ['./input-distance.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: InputDistanceComponent, multi: true }
  ]
})
export class InputDistanceComponent  implements OnInit, ControlValueAccessor{
  private changed = [];
  private touched = [];

  @Input() defaultUnit = DistanceUnit.Feet

  units = DistanceUnit.units
  _value: Distance;
  dist: number
  unit : string
  
  constructor() { 
  }

  ngOnInit() {

  }

  updateDist() {
    this._value.value = this.dist
    this.value = this._value
  }

  updateUnit(newUnit) {
    this.unit = newUnit
    this._value.unit  = this.unit
    this.value = this._value
  }

  refresh() {

  }
  get value(): Distance {
    return this._value;
  };

  set value(v: Distance) {
    if (v !== this._value) {
      this._value = v;
      this.dist = v.value
      this.unit = v.unit
      this.changed.forEach(f => {
        f(v)
      });
      this.refresh()
    }
  }

  writeValue(value: any) {
    this._value = value;
    this.refresh()
  }

  registerOnChange(fn: any): void {
    this.changed.push(fn);
  }

  registerOnTouched(fn: any): void {
    this.touched.push(fn);
  }
}