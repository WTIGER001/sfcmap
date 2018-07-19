import { Injectable } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { from, Observable, Subject } from 'rxjs';
import { MgrMapComponent } from '../mgr-map/mgr-map.component';
import { Distance } from '../models';
import { DistanceEntryComponent } from './distance-entry/distance-entry.component';

@Injectable()
export class DialogService {

  constructor(private modalSvc: NgbModal) {

  }

  public openMaps() {
    const modalRef = this.modalSvc.open(MgrMapComponent, { size: 'lg' });
  }
  public openDistance(): Observable<Distance> {

    const modalRef = this.modalSvc.open(DistanceEntryComponent);
    modalRef.componentInstance.result = new Subject<Distance>()
    return modalRef.componentInstance.result
  }
}
