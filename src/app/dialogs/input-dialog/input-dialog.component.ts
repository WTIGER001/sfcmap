import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.css']
})
export class InputDialogComponent implements OnInit {

  @Input() icon: string = "edit";
  @Input() title: string;
  @Input() message: string
  @Input() placeholder = ""
  @Input() value = ""
  @Input() helpText = ""

  public result: ReplaySubject<String> = new ReplaySubject();

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  ok() {
    this.result.next(this.value)
    this.activeModal.close(this.value)

  }
}
