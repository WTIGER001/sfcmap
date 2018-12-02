import { Component, OnInit } from '@angular/core';
import { Encounter, TokenRecord } from 'src/app/encounter/model/encounter';
import { Map } from 'leaflet';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { TokenAnnotation } from 'src/app/models';


@Component({
  selector: 'app-encounter-dialog',
  templateUrl: './encounter-dialog.component.html',
  styleUrls: ['./encounter-dialog.component.css']
})
export class EncounterDialogComponent implements OnInit {
  all : TokenRecord[]
  tokens : TokenAnnotation[]
  encounter: Encounter
  result : Subject<boolean>

  constructor(private dialog : NgbActiveModal) {

   }

  ngOnInit() {

  }

  findToken(item : TokenRecord) : TokenAnnotation {
    return this.tokens.find( t => t.id == item.id)
  }

  ok() {
    // Remove all the checked
    console.log("PART 1", this.encounter.participants)
    let keep =  this.all.filter( i => i._delete == false)
    this.encounter.participants = keep

    console.log("PART 2", this.encounter.participants)

    this.result.next(true)
    this.cancel()
  }

  cancel() {
    this.dialog.dismiss()
  }

}
