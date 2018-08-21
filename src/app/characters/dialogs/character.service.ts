import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImportCharacterComponent } from './import-character/import-character.component';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  constructor(private modalSvc: NgbModal) {

  }

  public openImport() {
    const modalRef = this.modalSvc.open(ImportCharacterComponent);
    return modalRef.componentInstance.result
  }
}
