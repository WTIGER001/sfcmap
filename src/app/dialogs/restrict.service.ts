import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AccessDialogComponent } from './access-dialog/access-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class RestrictService {

  constructor(private modalSvc: NgbModal) {

  }
  
  public openRestrict(view: string[], edit : string[]) : Observable<[string[], string[]]> {

    const modalRef = this.modalSvc.open(AccessDialogComponent,  { size: 'lg' });
    modalRef.componentInstance.inView = view;
    modalRef.componentInstance.inEdit = edit;
    
    return modalRef.componentInstance.result
  }
}
