import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Character, Roll } from '../../../models/character';
import { MessageService } from '../../../message.service';
import { DiceCanvasComponent } from '../../../controls/dice-canvas/dice-canvas.component';
import { NotifyService } from '../../../notify.service';

@Component({
  selector: 'app-view-character',
  templateUrl: './view-character.component.html',
  styleUrls: ['./view-character.component.css']
})
export class ViewCharacterComponent implements OnInit {
  @Input() character: Character
  @ViewChild('dice') dice: DiceCanvasComponent

  constructor(private msg: MessageService, private notify: NotifyService) { }

  ngOnInit() {
  }

  roll(r: Roll) {
    const expression = this.evaluate(r)
    console.log("Requesting Roll: ", expression);

    // this.msg.requestRoll(r.name + " " + expression)
    this.dice.rollDice(expression)
  }

  evaluate(r: Roll): string {
    return this.character.resolveExpression(r.expression)
  }

  diceRolled(result) {
    this.notify.success(this.character.name + " rolled a " + result.getTotal() + " on a " + result.expression)
  }
}
