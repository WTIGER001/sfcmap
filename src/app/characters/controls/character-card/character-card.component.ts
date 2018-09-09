import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Character, Roll, CharacterType, Prefs, DiceRoll, DiceResult } from '../../../models';
import { MessageService } from '../../../message.service';
import { DataService } from '../../../data.service';
import { AudioService, Sounds } from '../../../audio.service';
import { DiceCanvasComponent } from '../../../controls/dice-canvas/dice-canvas.component';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.css']
})
export class CharacterCardComponent implements OnInit {
  static pages = ['personal', 'description', 'rolls', 'stats']
  @ViewChild('dice') dice: DiceCanvasComponent
  @Input() size: string = 'card'
  @Input() character: Character
  @Input() position = 1
  direction = 0
  @Input() page = 'description'
  types: CharacterType[] = []
  diceResult: DiceRoll

  constructor(private data: DataService, private msg: MessageService, private audio: AudioService) {

  }

  ngOnInit() {
    this.data.gameAssets.characterTypes.items$.subscribe(a => this.types = a)
  }

  nextPage($event) {
    let indx = CharacterCardComponent.pages.indexOf(this.page)
    indx += 1;
    if (indx >= CharacterCardComponent.pages.length) {
      indx = 0;
    }
    this.page = CharacterCardComponent.pages[indx]
  }

  prevPage($event) {
    let indx = CharacterCardComponent.pages.indexOf(this.page)
    indx -= 1;
    if (indx < 0) {
      indx = CharacterCardComponent.pages.length - 1;
    }
    this.page = CharacterCardComponent.pages[indx]
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

  togglePosition() {
    if (this.position == 3 || this.position == 2) {
      this.direction = -1
      this.position = 1
    } else if (this.position == 1) {
      this.direction = 1
      this.position = 2
    }
  }

  togglePositionMax() {
    if (this.position == 3) {
      this.direction = -1
      this.position = 1
    } else if (this.position == 1) {
      this.direction = 1
      this.position = 3
    } else {
      this.position += this.direction
      this.position = this.direction == 1 ? 3 : 1
      this.direction *= -1
    }
  }

  roll($event, r: Roll) {
    this.dice.rollDice(this.character.name + " " + r.name + " " + this.evaluate(r))
  }

  evaluate(r: Roll): string {
    return this.character.resolveExpression(r.expression)
  }

  canView(): boolean {
    return this.data.canView(this.character)
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


}
