import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DiceCanvasComponent } from 'src/app/controls/dice-canvas/dice-canvas.component';
import { DiceRoll, Roll, Character, CharacterType } from 'src/app/models';
import { DataService } from 'src/app/data.service';
import { MessageService } from 'src/app/message.service';
import { AudioService } from 'src/app/audio.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCharacterCoreComponent } from '../edit-character-core/edit-character-core.component';
import { Subject } from 'rxjs';
import { EditCharacterDialogComponent } from '../edit-character-dialog/edit-character-dialog.component';
import { LangUtil } from 'src/app/util/LangUtil';
import { Assets } from 'src/app/assets';

@Component({
  selector: 'app-character-selection',
  templateUrl: './character-selection.component.html',
  styleUrls: ['./character-selection.component.css']
})
export class CharacterSelectionComponent implements OnInit {

  static pages = ['personal', 'description', 'rolls', 'stats']
  @ViewChild('dice') dice: DiceCanvasComponent
  @Input() character: Character
  @Input() noactions = false
  diceResult: DiceRoll
  types: CharacterType[] = []

  @Output() onPan = new EventEmitter()

  constructor(private data: DataService, private msg: MessageService, private audio: AudioService, private modalSvc: NgbModal) {

  }

  ngOnInit() {
    this.data.gameAssets.characterTypes.items$.subscribe(a => this.types = a)
  }

  getAttrValue(attr: string) {
    if (this.data.canViewField(this.character, 'attributes')) {
      let a = this.character.attributes.find(a => a.attr == attr)
      if (a) {
        return a.current
      } else {
        return "?"
      }
    } else {
      return "?"
    }
  }


  roll($event, r: Roll) {
    const rollId = this.character.rollId ? this.character.rollId : this.character.id
    this.dice.rollDice(this.character.name + " " + r.name + " " + this.evaluate(r), r.name, rollId)
  }

  evaluate(r: Roll): string {
    return this.character.resolveExpression(r.expression)
  }

  canView(): boolean {
    // return this.data.canView(this.character)
    return true;
  }

  lookupType() {
    let type = ''
    if (this.character.type) {
      let t = this.types.find(a => a.id == this.character.type)
      if (t) {
        type = t.name
      }
    }
    if (type == '') {
      type = 'Unknown'
    }
    return type
  }

  cleared(d: DiceRoll) {
    this.diceResult = undefined
  }

  rolled(d: DiceRoll) {
    this.diceResult = d
  }

  editCharacter() {
    EditCharacterDialogComponent.open(this.modalSvc, this.character)
    // const modalRef = this.modalSvc.open(EditCharacterDialogComponent);
    // // modalRef.componentInstance.result = new Subject<boolean>()
    // modalRef.componentInstance.character = this.character
    // // return modalRef.componentInstance.result
  }

  panTo() {
    this.onPan.emit()
  }

  pic() {
    return LangUtil.firstDefined(this.character.token, this.character.picture, Assets.CharacterCardSm)
  }
}
