import { Component, Output, Input, EventEmitter } from '@angular/core';
import { MarkerType, MapConfig, MapType } from '../../models';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MapService } from '../../maps/map.service';
import { DataService } from '../../data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MarkerTypeSelectComponent } from '../marker-type-select/marker-type-select.component';


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
  _mapId: string
  selected: MarkerType
  private innerValue
  private changed = [];
  private touched = [];
  private disabled: boolean;

  @Output() markerchange = new EventEmitter()

  all = []
  categories = []

  constructor(private mapSvc: MapService, private data: DataService, private modal : NgbModal) {

  }

  openDialog() {
    MarkerTypeSelectComponent.openDialog(this.modal).subscribe(
      m => {
        this.select(m)
      }
    )
  }

  @Input() set mapId(mapId: string) {
    this._mapId = mapId
    this.refresh()
  }

  @Input() set map(m: MapConfig) {
    this._map = m
    this.refresh()
  }

  @Input() set mapType(m: MapType) {
    this._mapType = m
    this.refresh()
  }

  get mapId(): string {
    return this._mapId
  }

  get map(): MapConfig {
    return this._map
  }

  get mapType(): MapType {
    return this._mapType
  }

  ngOnInit(): void {
    // this.all = this.data.categories.value
    this.data.categories.subscribe(categories => {
      this.all = categories
      this.refresh()
    })
  }

  refresh() {
    let mapTypeId = ''
    if (this.mapId) {
      mapTypeId = this.mapId
    } else if (this.map) {
      mapTypeId = this.map.mapType
    } else if (this.mapType) {
      mapTypeId = this.mapType.id
    }

    if (this.innerValue) {
      this.selected = this.mapSvc.getMarkerType(this.innerValue)
    }
  }

  name(): string {
    if (this.value) {
      let mk = this.mapSvc.getMarkerType(this.value)
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
    this.markerchange.emit(type.id)
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
    this.innerValue = obj;
    this.refresh()
  }
}
