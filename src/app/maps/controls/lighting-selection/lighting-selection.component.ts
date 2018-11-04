import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Character, TokenAnnotation, MapConfig, LightSource } from 'src/app/models';
import { TokenLightingEditComponent } from '../token-lighting-edit/token-lighting-edit.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../map.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-lighting-selection',
  templateUrl: './lighting-selection.component.html',
  styleUrls: ['./lighting-selection.component.css']
})
export class LightingSelectionComponent implements OnInit {
  @Input() item: Character | TokenAnnotation | MapConfig
  @Output() changes = new EventEmitter()
  lights : LightSource[] = []


  constructor(private modal: NgbModal, private mapSvc : MapService) { 
    mapSvc.annotationAddUpate.pipe(
      tap( a => this.updateLights())
    ).subscribe()

    mapSvc.annotationDelete.pipe(
      tap(a => this.updateLights())
    ).subscribe()
  }

  ngOnInit() {
  
  }

  updateLights() {
    const ann = this.mapSvc.annotationsFromMap()
    const lights: LightSource[] = []
    ann.forEach(a => {
      if (TokenAnnotation.is(a)) {
        lights.push(...a.lights)
      }
    })
    this.lights = lights
  }

  toggle(item : LightSource) {
    item.enabled = !item.enabled

    this.emitChanges() 
  }

  edit(light : LightSource) {
    TokenLightingEditComponent.openDialog(this.modal, light).subscribe(a => { this.emitChanges() })
  }

  delete(light : LightSource) {
    
  }

  addRow() {
    
  }

  emitChanges() {
    this.changes.emit()
  }
}
