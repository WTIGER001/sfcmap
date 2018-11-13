import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TokenBar, Attribute } from 'src/app/models';
import { ReplaySubject, Observable } from 'rxjs';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-token-bar-edit',
  templateUrl: './token-bar-edit.component.html',
  styleUrls: ['./token-bar-edit.component.css']
})
export class TokenBarEditComponent implements OnInit {

  bar : TokenBar= new TokenBar()
  attributes: Attribute[] = []

  result = new ReplaySubject<TokenBar>(1)

  constructor(private activeModal : NgbActiveModal) { }

  ngOnInit() {
  }

  ok() {
    this.result.next(this.bar)
    this.result.complete()
    this.activeModal.dismiss()
  }

  cancel() {
    this.result.complete()
    this.activeModal.dismiss()
  }

  update() {

  }


  public static openDialog(modal: NgbModal, bar: TokenBar, attributes?: Attribute[]) : Observable<TokenBar> {
    const inst = modal.open(TokenBarEditComponent)
    inst.componentInstance.bar = bar
    inst.componentInstance.attributes = attributes
    return inst.componentInstance.result
  }
}
