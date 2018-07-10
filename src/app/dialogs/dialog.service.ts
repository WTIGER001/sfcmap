import { Injectable } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { from, Observable, Subject } from 'rxjs';
import { MgrMarkerComponent } from '../mgr-marker/mgr-marker.component';
import { MgrGroupComponent } from '../mgr-group/mgr-group.component';
import { MgrMapComponent } from '../mgr-map/mgr-map.component';
import { AccessDialogComponent } from './access-dialog/access-dialog.component';
import { Distance } from '../models';
import { DistanceEntryComponent } from './distance-entry/distance-entry.component';

@Injectable()
export class DialogService {

  constructor(private modalSvc: NgbModal) {

  }

  public openMarkers() {
    const modalRef = this.modalSvc.open(MgrMarkerComponent, { size: 'lg' });
  }
  public openGroups() {
    const modalRef = this.modalSvc.open(MgrGroupComponent, { size: 'lg' });
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
