import { Component, Output, forwardRef, Input, OnInit } from '@angular/core';
import { MarkerService } from '../../marker.service';
import { MarkerType, MapConfig, MapType } from '../../models';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-marker-combo',
  templateUrl: './marker-combo.component.html',
  styleUrls: ['./marker-combo.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: MarkerComboComponent, multi: true }
  ]
})
export class MarkerComboComponent implements ControlValueAccessor {
  @Input() map: MapConfig
  @Input() mapType: MapType
  private innerValue
  private changed = [];
  private touched = [];
  private disabled: boolean;

  categories = []

  constructor(private mks: MarkerService) {
    
  }

  ngOnInit(): void {
    let mapTypeId = ''
    if (this.map) {
      mapTypeId = this.map.mapType
    } else if (this.mapType) {
      mapTypeId = this.mapType.id
    }

    this.mks.catsLoaded.subscribe(v => {
      this.categories = this.mks.categories.filter(c => {
        console.log(c)
        if (c.appliesTo && c.appliesTo.length > 0) {
          return c.appliesTo.includes(mapTypeId) 
        } else {
          return true
        }
      })
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
  }

  get value(): string {
    return this.innerValue;
  }

  set value(value: string) {
    if (this.innerValue !== value) {
      this.innerValue = value;
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
    this.innerValue = obj;
  }
}
