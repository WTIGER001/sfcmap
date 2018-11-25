import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Character, Roll } from '../../../models/character';
import { DiceCanvasComponent } from 'src/app/controls/dice-canvas/dice-canvas.component';
import { tap } from 'rxjs/operators';
import { DiceRoll } from 'src/app/models';
import { CommonDialogService } from 'src/app/dialogs/common-dialog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiceResultComponent } from 'src/app/controls/dice-result/dice-result.component';

@Component({
  selector: 'app-edit-chr-rolls',
  templateUrl: './edit-chr-rolls.component.html',
  styleUrls: ['./edit-chr-rolls.component.css']
})
export class EditChrRollsComponent implements OnInit {

  @Input() character: Character
  @Input() dice : DiceCanvasComponent
  @Output() changes = new EventEmitter()

  constructor(private dialog : CommonDialogService, private modal : NgbModal) { }

  ngOnInit() {

  }

  addRow() {
    this.character.rolls.push(new Roll())
  }
  roll(r  : Roll) {
    const rollId = this.character.rollId ? this.character.rollId : this.character.id
    this.dice.rollDice(this.character.name + " " + r.name + " " + this.character.resolveExpression(r.expression), r.name, rollId)
  }
}
