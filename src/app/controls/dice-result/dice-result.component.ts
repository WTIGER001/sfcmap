import { Component, OnInit } from '@angular/core';
import { DiceRoll } from 'src/app/models';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-dice-result',
  templateUrl: './dice-result.component.html',
  styleUrls: ['./dice-result.component.css']
})
export class DiceResultComponent implements OnInit {
  roll: DiceRoll
  result: Subject<boolean>

  constructor(private activeModal : NgbActiveModal) { 

  }

  ngOnInit() {
  }

  cancel() {
    this.activeModal.dismiss()
    this.result.next()
    this.result.complete()
  }
  
  public static showDialog(modal: NgbModal, roll : DiceRoll, timeout ?: number) : Observable<boolean>  {
    const rtn = new Subject<boolean>()
    const d = modal.open(DiceResultComponent)
    d.componentInstance.roll = roll
    d.componentInstance.result = rtn

    if (timeout) {
      setTimeout(() => {
        d.dismiss("timeout")
        rtn.next()
        rtn.complete()
      }, timeout);
    }
    return rtn;
  }
}
