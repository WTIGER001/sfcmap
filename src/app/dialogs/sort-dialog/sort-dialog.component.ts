import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SortData, SortFilterData, SortFilterField } from '../../util/sort-filter';

@Component({
  selector: 'app-sort-dialog',
  templateUrl: './sort-dialog.component.html',
  styleUrls: ['./sort-dialog.component.css']
})
export class SortDialogComponent implements OnInit, AfterContentInit {
  result: Subject<SortFilterData>
  config: SortFilterData
  selection: SortFilterData = new SortFilterData()

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    console.log("CONFIGURING SORT ", this.config, this.selection);

    this.selection.copyFrom(this.config)
  }

  setSort(field: SortFilterField, direction: number) {
    this.selection.sortField = field
    this.selection.direction = direction
  }

  ok() {
    this.result.next(this.selection)
    this.result.complete()
    this.activeModal.close()
  }

  cancel() {
    this.result.complete()
    this.activeModal.close()
  }

}
