import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/data.service';
import { Character } from 'src/app/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-character-dialog',
  templateUrl: './edit-character-dialog.component.html',
  styleUrls: ['./edit-character-dialog.component.css']
})
export class EditCharacterDialogComponent implements OnInit {
  character : Character
  constructor(private dialog: NgbActiveModal, private  data : DataService) { }

  ngOnInit() {
  }

  save(character: Character) {
    this.data.save(character)
    this.dialog.dismiss()
  }

  cancel(character: Character) {
    console.log("Cancel Event")
    this.dialog.dismiss()

  }

  delete(character: Character) {
    this.dialog.dismiss()
  }

  static open(modalSvc: NgbModal, character: Character){
    const modalRef = modalSvc.open(EditCharacterDialogComponent);
    // modalRef.componentInstance.result = new Subject<boolean>()
    modalRef.componentInstance.character = character
    // return modalRef.componentInstance.result
  }
}
