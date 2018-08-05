import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Character, Roll } from '../../../models/character';

@Component({
  selector: 'app-edit-chr-rolls',
  templateUrl: './edit-chr-rolls.component.html',
  styleUrls: ['./edit-chr-rolls.component.css']
})
export class EditChrRollsComponent implements OnInit {
  @Input() character: Character

  @Output() changes = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  addRow() {
    this.character.rolls.push(new Roll())
  }
}
