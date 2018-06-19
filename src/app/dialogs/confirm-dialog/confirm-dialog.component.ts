import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  @Input() title: string = "Confirm"
  @Input() message: string = "Are you sure?"
  @Input() yesText = "Yes"
  @Input() noText = "No"
  @Output() result = new EventEmitter<Boolean>()

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  anwser(value: boolean) {
    this.result.emit(value);
    this.activeModal.close(value);
  }
}
