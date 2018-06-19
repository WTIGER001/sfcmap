import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReplaySubject } from 'rxjs';
import { MarkerType } from '../../models';

@Component({
  selector: 'app-marker-dialog',
  templateUrl: './marker-dialog.component.html',
  styleUrls: ['./marker-dialog.component.css']
})
export class MarkerDialogComponent implements OnInit {
  public result: ReplaySubject<MarkerType> = new ReplaySubject();

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
