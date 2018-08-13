import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../../../models';

@Component({
  selector: 'app-encounter-card',
  templateUrl: './encounter-card.component.html',
  styleUrls: ['./encounter-card.component.css']
})
export class EncounterCardComponent implements OnInit {
  @Input() character: Character
  @Input() current: boolean
  @Input() size: 'small' | 'regular' | 'extended' = 'regular'
  constructor() { }

  ngOnInit() {
  }

  getAttrValue(attr: string) {
    let a = this.character.attributes.find(a => a.attr == attr)
    if (a) {
      return a.current
    } else {
      return "?"
    }
  }

}
