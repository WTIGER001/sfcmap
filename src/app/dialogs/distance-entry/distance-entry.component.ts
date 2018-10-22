import { Component, OnInit, AfterViewInit, ViewChildren } from '@angular/core';
import { NgbActiveModal,  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Distance } from '../../models';
import { ReplaySubject, Subject, Observable } from 'rxjs';
import { DistanceUnit } from '../../util/transformation';

@Component({
  selector: 'app-distance-entry',
  templateUrl: './distance-entry.component.html',
  styleUrls: ['./distance-entry.component.css']
})
export class DistanceEntryComponent implements OnInit, AfterViewInit {
  public result: Subject<Distance>;
  value: number
  unit: string = "M"
  units = DistanceUnit.units

  @ViewChildren('input') vc;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.vc.changes.subscribe(elements => {
      elements.last.nativeElement.focus();
    });
  }

  ok() {
    let distance = new Distance(this.value, this.unit)
    this.result.next(distance)
    this.activeModal.close(distance)
  }

  public static open(modalSvc : NgbModal): Observable<Distance> {
    const modalRef = modalSvc.open(DistanceEntryComponent);
    modalRef.componentInstance.result = new Subject<Distance>()
    return modalRef.componentInstance.result
  }
}
