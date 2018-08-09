import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../data.service';
import { MergedMapType } from '../../models';
import { AbstractValueAccessor } from '../value-accessor';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-map-select',
  templateUrl: './map-select.component.html',
  styleUrls: ['./map-select.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: MapSelectComponent, multi: true }
  ]
})
export class MapSelectComponent extends AbstractValueAccessor implements OnInit {

  // @Input() mapId: string

  @Output() mapChanged = new EventEmitter()
  merged: MergedMapType[] = []

  constructor(data: DataService) {
    super()
    data.mapTypesWithMaps.subscribe(all => this.merged = all)
  }

  ngOnInit() {
  }

  updateSelection() {
    console.log("I CHANGED");
    this.mapChanged.emit(this.value)
  }

  refresh() {
  }

}
