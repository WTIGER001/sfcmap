import { Injectable } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { from, Observable } from 'rxjs';

@Injectable()
export class CommonDialogService {

  constructor(private modalSvc: NgbModal) {

  }

  public messageDialog(message: string, title: string = "Message", icon: string = "info-circle") {
    const modalRef = this.modalSvc.open(MessageDialogComponent);
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.icon = icon;
  }

  public confirm(message: string, title: string = "Confirm", yesText = "Yes", noText = "No"): Observable<Boolean> {
    const modalRef = this.modalSvc.open(ConfirmDialogComponent);
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.yesText = yesText;
    modalRef.componentInstance.noText = noText;
    return from(modalRef.result)
  }

  public inputDialog(message: string, title: string, value = "", placeholder = "", helpText = "", icon: string = "edit"): Observable<String> {
    const modalRef = this.modalSvc.open(InputDialogComponent);
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.icon = icon;
    modalRef.componentInstance.value = value;
    modalRef.componentInstance.placeholder = placeholder;
    modalRef.componentInstance.helpText = helpText;
    modalRef.componentInstance.icon = icon;
    return modalRef.componentInstance.result
  }

  public errorMsg(error: string, title = "Error") {
    this.messageDialog(error, title, 'exclamation-triangle');
  }

}
