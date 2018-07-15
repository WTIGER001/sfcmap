import { Component, OnInit, Input } from '@angular/core';
import { MapConfig, MarkerGroup, MapType } from '../../models';
import { DataService } from '../../data.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-map-type-combo',
  templateUrl: './map-type-combo.component.html',
  styleUrls: ['./map-type-combo.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: MapTypeComboComponent, multi: true }
  ]
})
export class MapTypeComboComponent implements ControlValueAccessor {
  selected: MapType
  mk: MapConfig
  private innerValue: string
  private changed = [];
  private touched = [];
  private disabled: boolean;

  all: MapType[] = []
  options = []

  constructor(private data: DataService) {

  }

  @Input() set map(m: MapConfig) {
    this.mk = m
    this.innerValue = m.mapType
    this.refresh()
  }

  get marker(): MapConfig {
    return this.mk
  }

  onTextChange($event) {
    console.log($event);
    this.value = event.target['value']
  }

  refresh() {
    this.data.mapTypes
      .subscribe(v => {
        this.all = v
        if (this.innerValue) {
          this.selected = this.all.find(mg => mg.id == this.innerValue)
        }
      })
  }

  name(): string {
    if (this.selected) {
      return this.selected.name
    } else if (this.innerValue) {
      let item = this.all.find(mg => mg.id == this.innerValue)
      if (item) {
        return item.name
      }
      return this.innerValue
    }
    return ''
  }

  select(type: MapType) {
    this.value = type.id
    this.selected = type
  }

  get value(): string {
    return this.innerValue;
  }

  set value(value: string) {
    if (this.innerValue !== value) {
      this.innerValue = value;
      this.refresh()
      this.changed.forEach(f => f(value));
    }
  }

  registerOnChange(fn: any): void {
    this.changed.push(fn);
  }

  registerOnTouched(fn: any): void {
    this.touched.push(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: string): void {
    console.log(obj);
    this.innerValue = obj;
    this.refresh()
  }
}
