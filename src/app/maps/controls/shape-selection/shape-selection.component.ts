import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ShapeAnnotation } from 'src/app/models';
import { LatLng, Point } from 'leaflet';
import { MapService } from '../../map.service';
import { Format } from 'src/app/util/format';
import { DataService } from 'src/app/data.service';
import { LangUtil } from 'src/app/util/LangUtil';

@Component({
  selector: 'app-shape-selection',
  templateUrl: './shape-selection.component.html',
  styleUrls: ['./shape-selection.component.css']
})
export class ShapeSelectionComponent implements OnInit {
  @Input() item : ShapeAnnotation
  @Output() onPan = new EventEmitter()

  constructor(private mapSvc : MapService, private data : DataService) { }

  ngOnInit() {
  }

  panTo() {
    this.onPan.emit()
  }

  convertToBarrier() {
  
  }
}
