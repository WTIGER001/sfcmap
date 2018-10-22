import { Component, OnInit } from '@angular/core';
import { Monster } from '../../monster';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-monster-view-dialog',
  templateUrl: './monster-view-dialog.component.html',
  styleUrls: ['./monster-view-dialog.component.css']
})
export class MonsterViewDialogComponent implements OnInit {
  item : Monster

  
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  cancel() {
    this.activeModal.dismiss()
  }

  save() {

  }

  delete() {
    
  }
  public static openViewDialog(modal: NgbModal, item: Monster) {
    const ref = modal.open(MonsterViewDialogComponent)
    ref.componentInstance.item = item
  }
}
