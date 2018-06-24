import { Component, Output, forwardRef, Input, OnInit } from '@angular/core';
import { MarkerService } from '../../marker.service';
import { MarkerType, MapConfig, MapType } from '../../models';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { typeSourceSpan } from '@angular/compiler';


@Component({
  selector: 'app-marker-combo',
  templateUrl: './marker-combo.component.html',
  styleUrls: ['./marker-combo.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: MarkerComboComponent, multi: true }
  ]
})
export class MarkerComboComponent implements ControlValueAccessor {
  _map: MapConfig
  _mapType: MapType
  selected : MarkerType
  private innerValue 
  private changed = [];
  private touched = [];
  private disabled: boolean;


  all = []
  categories = []

  constructor(private mks: MarkerService) {

  }

  @Input() set map(m: MapConfig) {
    this._map = m
    this.refresh()
  }

  @Input() set mapType(m: MapType) {
    this._mapType = m
    this.refresh()
  }

  get map(): MapConfig {
    return this._map
  }

  get mapType(): MapType {
    return this._mapType
  }

  ngOnInit(): void {
    this.mks.catsLoaded.subscribe(v => {
      this.all = this.mks.categories
      this.refresh()
    })
  }

  refresh() {
    let mapTypeId = ''
    if (this.map) {
      mapTypeId = this.map.mapType
    } else if (this.mapType) {
      mapTypeId = this.mapType.id
    }
    if (this.innerValue) {
      this.selected = this.mks.getMarkerType(this.innerValue)
    }

    this.categories = this.all.filter(c => {
      console.log(c)
      if (c.appliesTo && c.appliesTo.length > 0) {
        return c.appliesTo.includes(mapTypeId)
      } else {
        return true
      }
    })
  }

  name(): string {
    if (this.value) {
      let mk = this.mks.getMarkerType(this.value)
      if (mk) {
        return mk.name
      }
      return 'Ugh....'
    } else {
      return ''
    }
  }


  select(type: MarkerType) {
    this.value = type.id
    this.selected = type
  }

  get value(): string {
    return this.innerValue;
  }

  set value(value: string) {
    console.log("Setting to : " + value);
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
    console.log("writeValue to : " + obj);
    this.innerValue = obj;
    this.refresh()
  }
}