import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Aura } from 'src/app/models/aura';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-aura-edit',
  templateUrl: './aura-edit.component.html',
  styleUrls: ['./aura-edit.component.css']
})
export class AuraEditComponent implements OnInit {
  aura : Aura
  result : ReplaySubject < Aura >
  constructor(private activeModal : NgbActiveModal) { 

  }

  ngOnInit() {

  }

  ok() {
    this.activeModal.dismiss()
    this.result.next(this.aura)
    this.result.complete()
  }

  cancel() {
    this.activeModal.dismiss()
    this.result.complete()
  }

  update() {
    
  }

  public static openDialog(modal: NgbModal, aura: Aura): Observable<Aura> {
    const rtn = new ReplaySubject<Aura>(1)

    const ctx = modal.open(AuraEditComponent)
    ctx.componentInstance.aura = aura
    ctx.componentInstance.result = rtn;

    return rtn
  }

}
