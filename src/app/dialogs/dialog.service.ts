import { Injectable } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { from, Observable, Subject } from 'rxjs';
import { Distance, FilterData, SortData } from '../models';
import { DistanceEntryComponent } from './distance-entry/distance-entry.component';
import { SortDialogComponent } from './sort-dialog/sort-dialog.component';

@Injectable()
export class DialogService {

  constructor(private modalSvc: NgbModal) {

  }

  public openDistance(): Observable<Distance> {
    const modalRef = this.modalSvc.open(DistanceEntryComponent);
    modalRef.componentInstance.result = new Subject<Distance>()
    return modalRef.componentInstance.result
  }

  public openSort(sortFields: string[], current?: SortData): Observable<SortData> {
    const modalRef = this.modalSvc.open(SortDialogComponent);
    modalRef.componentInstance.result = new Subject<SortData>()
    modalRef.componentInstance.sortFields = sortFields
    modalRef.componentInstance.selection = current
    return modalRef.componentInstance.result
  }

  public openFilter(filterFields: string, filterValues: FilterData, current: FilterData): Observable<FilterData> {
    const modalRef = this.modalSvc.open(SortDialogComponent);
    modalRef.componentInstance.result = new Subject<FilterData>()
    modalRef.componentInstance.filterFields = filterFields
    modalRef.componentInstance.filterValues = filterValues
    modalRef.componentInstance.current = current
    return modalRef.componentInstance.result
  }
}
