import { Component, OnInit, Input } from '@angular/core';
import { Character, Roll } from '../../../models/character';
import { MessageService } from '../../../message.service';

@Component({
  selector: 'app-view-character',
  templateUrl: './view-character.component.html',
  styleUrls: ['./view-character.component.css']
})
export class ViewCharacterComponent implements OnInit {
  @Input() character: Character

  constructor(private msg: MessageService) { }

  ngOnInit() {
  }

  roll(r: Roll) {
    const expression = this.evaluate(r)
    console.log("Requesting Roll: ", expression);

    this.msg.requestRoll(r.name + " " + expression)
  }

  evaluate(r: Roll): string {
    return this.character.resolveExpression(r.expression)
  }
}
