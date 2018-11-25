import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MarkerType, MarkerCategory } from 'src/app/models';
import { MapService } from 'src/app/maps/map.service';
import { CommonDialogService } from 'src/app/dialogs/common-dialog.service';
import { DataService } from 'src/app/data.service';
import { tap } from 'rxjs/operators';
import { Subject, Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-marker-type-select',
  templateUrl: './marker-type-select.component.html',
  styleUrls: ['./marker-type-select.component.css']
})
export class MarkerTypeSelectComponent implements OnInit {

  selected : MarkerType
  folders: MarkerCategory[] = []
  markers: MarkerType[] = []
  result : Subject<MarkerType>

  constructor(private mapSvc: MapService, private cd: CommonDialogService, private data: DataService, private activeModal: NgbActiveModal) {
    this.data.gameAssets.markerCategories.items$.pipe(
      tap(items => this.folders = items.sort((a, b) => a.name > b.name ? 1 : -1))
    ).subscribe()
    this.data.gameAssets.markerTypes.items$.pipe(
      tap(items => this.markers = items.sort((a, b) => a.name > b.name ? 1 : -1))
    ).subscribe()
  }

  ngOnInit() {
  }

  select(t) {
    this.selected = t
  }

  selectAndOk(t) {
    this.select(t)
    this.ok()
  }

  ok() {
    if (this.selected) {
      this.result.next(this.selected)
    }
    this.result.complete()
    this.activeModal.dismiss()
  }

  close() {
    this.result.complete()
    this.activeModal.dismiss()
  }

  public static openDialog(modal: NgbModal) : Observable<MarkerType> {
    const rtn = new ReplaySubject<MarkerType>(1)
    const d = modal.open(MarkerTypeSelectComponent)
    d.componentInstance.result = rtn
    return rtn
  }
}