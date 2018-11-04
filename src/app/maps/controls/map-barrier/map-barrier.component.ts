import { Component, Input,  Output, EventEmitter } from '@angular/core';
import { MapConfig, TokenAnnotation, BarrierAnnotation } from 'src/app/models';
import { MapService } from '../../map.service';
import { tap } from 'rxjs/operators';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-map-barrier',
  templateUrl: './map-barrier.component.html',
  styleUrls: ['./map-barrier.component.css']
})
export class MapBarrierComponent  {
  @Input() item : MapConfig
  @Output() changes = new EventEmitter()
  barriers : BarrierAnnotation[] = []

  constructor(private mapSvc: MapService, private data : DataService) {
    mapSvc.annotationAddUpate.pipe(
      tap(a => this.updateLights())
    ).subscribe()

    mapSvc.annotationDelete.pipe(
      tap(a => this.updateLights())
    ).subscribe()
  }

  ngOnInit() {

  }

  updateLights() {
    const ann = this.mapSvc.annotationsFromMap()
    const barriers:  BarrierAnnotation[] = []
    ann.forEach(a => {
      if (BarrierAnnotation.is(a)) {
        barriers.push(a)
      }
    })
    this.barriers = barriers
  }

  toggle(barrier: BarrierAnnotation) {
    barrier.enabled = !barrier.enabled
    this.changes.emit(barrier)
  }

  delete(barrier : BarrierAnnotation) {
    this.data.delete(barrier)
  }

}
