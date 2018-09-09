import { Injectable } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { from, Observable, Subject } from 'rxjs';
import { Distance, Game } from '../models';
import { DistanceEntryComponent } from './distance-entry/distance-entry.component';
import { SortDialogComponent } from './sort-dialog/sort-dialog.component';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { SortFilterData } from '../util/sort-filter';
import { LinksComponent } from './links/links.component';

@Injectable()
export class DialogService {

  constructor(private modalSvc: NgbModal) {

  }

  public openDistance(): Observable<Distance> {
    const modalRef = this.modalSvc.open(DistanceEntryComponent);
    modalRef.componentInstance.result = new Subject<Distance>()
    return modalRef.componentInstance.result
  }

  public openSort(config: SortFilterData): Observable<SortFilterData> {
    const modalRef = this.modalSvc.open(SortDialogComponent);
    modalRef.componentInstance.result = new Subject<SortFilterData>()
    modalRef.componentInstance.config = config
    return modalRef.componentInstance.result
  }

  public openFilter(config: SortFilterData): Observable<SortFilterData> {
    const modalRef = this.modalSvc.open(FilterDialogComponent);
    modalRef.componentInstance.result = new Subject<SortFilterData>()
    modalRef.componentInstance.config = config
    return modalRef.componentInstance.result
  }

  public openLinks(game: Game, type: string): Observable<boolean> {
    console.log("LINKS TYPE", type, new Error());
    
    const modalRef = this.modalSvc.open(LinksComponent);
    modalRef.componentInstance.result = new Subject<boolean>()
    modalRef.componentInstance.game = game
    modalRef.componentInstance.type = type
    return modalRef.componentInstance.result
  }

}
