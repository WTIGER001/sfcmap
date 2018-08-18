import { Component, OnInit, Input } from '@angular/core';
import { SortData } from '../../models';
import { Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sort-dialog',
  templateUrl: './sort-dialog.component.html',
  styleUrls: ['./sort-dialog.component.css']
})
export class SortDialogComponent implements OnInit {
  result: Subject<SortData>
  sortFields: string[]

  selection: SortData = undefined

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  setSort(item: string, direction: number) {
    const i = new SortData()
    i.direction = direction
    i.field = item
    this.selection = i
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
