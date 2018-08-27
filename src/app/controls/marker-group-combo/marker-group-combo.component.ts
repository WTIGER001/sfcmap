import { Component, OnInit, Input } from '@angular/core';
import { MapConfig, MarkerGroup } from '../../models';
import { DataService } from '../../data.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Annotation } from '../../models';
import { MapService } from '../../maps/map.service';
import { map } from 'rxjs/operators';
// import { MyMarker } from '../../map.service';

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
  single: Annotation
  mks: Annotation[]
  private innerValue: string
  private changed = [];
  private touched = [];
  private disabled: boolean;

  all: MarkerGroup[] = []
  options = []

  constructor(private data: DataService, private mapSvc: MapService) {

  }

  @Input() set annotation(m: Annotation) {
    this.single = m
    this.innerValue = m.group
    this.refresh()
  }

  get annotation(): Annotation {
    return this.single
  }

  @Input() set annotations(m: Annotation[]) {
    this.mks = m
    this.innerValue = m[0].group
    this.refresh()
  }

  get annotations(): Annotation[] {
    return this.mks
  }

  onTextChange($event) {
    console.log($event);
    this.value = event.target['value']
  }

  refresh() {
    this.data.gameAssets.annotationFolders.items$.pipe(map(items => items.filter(i => i.map == this.mapSvc._mapCfg.id)))
    this.mapSvc.completeMarkerGroups
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

  select(type: MarkerGroup) {
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
