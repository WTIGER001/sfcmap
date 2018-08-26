import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AccessDialogComponent } from './access-dialog/access-dialog.component';
import { Asset } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RestrictService {

  constructor(private modalSvc: NgbModal) {

  }
  
  public openRestrict(item : Asset) : Observable<[string[], string[]]> {

    const modalRef = this.modalSvc.open(AccessDialogComponent,  { size: 'lg' });
    modalRef.componentInstance.item = item;
    
    return modalRef.componentInstance.result
  }
}
