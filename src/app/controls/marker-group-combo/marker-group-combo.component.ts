import { Component, OnInit, Input } from '@angular/core';
import { MapConfig, MarkerGroup } from '../../models';
import { DataService } from '../../data.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MyMarker } from '../../map.service';

@Component({
  selector: 'app-marker-group-combo',
  templateUrl: './marker-group-combo.component.html',
  styleUrls: ['./marker-group-combo.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: MarkerGroupComboComponent, multi: true }
  ]
})
export class MarkerGroupComboComponent implements ControlValueAccessor {
  selected: MarkerGroup
  mk: MyMarker
  private innerValue: string
  private changed = [];
  private touched = [];
  private disabled: boolean;

  all: MarkerGroup[] = []
  options = []

  constructor(private data: DataService) {

  }

  @Input() set marker(m: MyMarker) {
    this.mk = m
    this.innerValue = m.markerGroup
    this.refresh()
  }

  get marker(): MyMarker {
    return this.mk
  }

  onTextChange($event) {
    console.log('---------TEXT------');
    console.log($event);
    this.value = event.target['value']
    console.log(this.innerValue);
    console.log('---------------');
    // this.innerValue.markerGroup = event
  }

  refresh() {
    this.data.getMarkerGroups(this.marker.map)
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
      return this.innerValue
    }
    return ''
  }


  select(type: MarkerGroup) {
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
    console.log('---------------');
    console.log(obj);
    console.log('---------------');

    this.innerValue = obj;
    this.refresh()
  }
}
