import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SortFilterData, SortFilterField, SortFilterUtil } from '../../util/sort-filter';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.css']
})
export class FilterDialogComponent implements OnInit, AfterContentInit {

  config: SortFilterData
  selection: SortFilterData = new SortFilterData()
  result: Subject<SortFilterData>

  constructor(private activeModal: NgbActiveModal) { }

  ngAfterContentInit() {
    this.selection.copyFrom(this.config)
  }

  ngOnInit() {
  }

  isChecked(field: SortFilterField, value: any) {
    return this.selection.value(field, value)
  }

  toggle(field: SortFilterField, value: any) {
    this.selection.toggle(field, value)
  }

  toggleAll(field: SortFilterField) {
    this.selection.toggleAll(field)
  }

  ok() {
    this.result.next(this.selection)
    this.result.complete()
    this.activeModal.dismiss()
  }

  cancel() {
    this.result.complete()
    this.activeModal.dismiss()
  }

  format(field: SortFilterField, value) {
    return SortFilterUtil.format(value, field)
  }
}
