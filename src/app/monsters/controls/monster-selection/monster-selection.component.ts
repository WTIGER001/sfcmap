import { Component, OnInit, AfterContentInit, Input, Output, EventEmitter } from '@angular/core';
import { Game, Asset, Character, TokenAnnotation } from 'src/app/models';
import { Monster } from '../../monster';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { RestrictService } from 'src/app/dialogs/restrict.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MonsterViewDialogComponent } from '../monster-view-dialog/monster-view-dialog.component';
import { MonsterToCharacter } from '../../to-character';

@Component({
  selector: 'app-monster-selection',
  templateUrl: './monster-selection.component.html',
  styleUrls: ['./monster-selection.component.css']
})
export class MonsterSelectionComponent implements AfterContentInit {
  @Input() item: Monster
  @Input() token : TokenAnnotation
  @Output() onPan = new EventEmitter()
  character: Character
  
  constructor( private data: DataService, private modal : NgbModal) {

  }

  ngAfterContentInit() {
    if (this.token) {
      this.character = this.data.getTokenCharacter(this.token)
    } else {
      this.character = MonsterToCharacter.convert(this.item)
    }
    this.character.rollId = this.item.id
  }

  openDialog() {
    MonsterViewDialogComponent.openViewDialog(this.modal, this.item)
  }

  sentences(text: string): string[] {
    return text.split(".").map(item => item + ".")
  }

  specialAbilities(text: string): KeyValue[] {
    let items = text.split(".").map(item => item + ".")
    return items.map(item => {
      const indx = item.indexOf(")")
      if (indx > 0) {
        return new KeyValue(item.substring(0, indx), item.substr(indx))
      } else {
        return new KeyValue("UNK", item)
      }
    })
  }

  viewAny(...fields: string[]) {
    let yes = true
    // fields.forEach(f => {
    //   yes = yes && this.data.canViewField(this.monster, f)
    // })
    return yes
  }

  panTo() {
    this.onPan.emit()
  }

}

export class KeyValue {
  constructor(public key: string, public value: string) { }
}
export class KeyValueNum {
  constructor(public key: string, public value: string, public num: number) { }
}