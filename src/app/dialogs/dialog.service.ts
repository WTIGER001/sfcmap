import { Injectable } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { from, Observable } from 'rxjs';
import { MgrMarkerComponent } from '../mgr-marker/mgr-marker.component';
import { MgrGroupComponent } from '../mgr-group/mgr-group.component';
import { MgrMapComponent } from '../mgr-map/mgr-map.component';
import { AccessDialogComponent } from './access-dialog/access-dialog.component';

@Injectable()
export class DialogService {

  constructor(private modalSvc: NgbModal) {

  }

  public openMarkers() {
    const modalRef = this.modalSvc.open(MgrMarkerComponent,  { size: 'lg' });
  }
  public openGroups() {
    const modalRef = this.modalSvc.open(MgrGroupComponent,  { size: 'lg' });
  } 
  public openMaps() {
    const modalRef = this.modalSvc.open(MgrMapComponent,  { size: 'lg' });
  }  
}
