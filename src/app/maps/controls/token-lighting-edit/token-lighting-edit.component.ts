import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, ReplaySubject } from 'rxjs';
import { LightSource } from 'src/app/models';

@Component({
  selector: 'app-token-lighting-edit',
  templateUrl: './token-lighting-edit.component.html',
  styleUrls: ['./token-lighting-edit.component.css']
})
export class TokenLightingEditComponent implements OnInit {
  item : LightSource
  result: ReplaySubject<LightSource>
  levels = [1,2,3,4,5,6,7,8,9]
  constructor(private activeModal : NgbActiveModal) { }

  ngOnInit() {
  }

  update() {

  }

  ok() {
    this.result.next(this.item)
    this.activeModal.dismiss()
  }

  cancel() {
    this.activeModal.dismiss()
  }


  public static openDialog(modal : NgbModal, item : LightSource) : Observable<LightSource> {
    const dialog = modal.open(TokenLightingEditComponent)
    dialog.componentInstance.item = item
    dialog.componentInstance.result = new ReplaySubject<LightSource>(1)

    return dialog.componentInstance.result 
  }
}
