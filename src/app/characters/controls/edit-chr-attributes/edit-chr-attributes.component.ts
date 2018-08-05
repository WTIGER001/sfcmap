import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Character, Attribute } from '../../../models/character';

@Component({
  selector: 'app-edit-chr-attributes',
  templateUrl: './edit-chr-attributes.component.html',
  styleUrls: ['./edit-chr-attributes.component.css']
})
export class EditChrAttributesComponent implements OnInit {
  @Input() character: Character

  @Output() changes = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  addRow() {
    let attr = new Attribute()
    this.character.attributes.push(attr)
  }
}
