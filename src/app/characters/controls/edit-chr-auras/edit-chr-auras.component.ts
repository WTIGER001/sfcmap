import { Component, OnInit, Input } from '@angular/core';
import { Character } from 'src/app/models';
import { Aura } from 'src/app/models/aura';

@Component({
  selector: 'app-edit-chr-auras',
  templateUrl: './edit-chr-auras.component.html',
  styleUrls: ['./edit-chr-auras.component.css']
})
export class EditChrAurasComponent implements OnInit {
  @Input() character : Character

  constructor() { }

  ngOnInit() {
  }


  addRow() {
    let a = new Aura()
    this.character.auras.push(a)
  }

  updateUnit(aura : Aura, unit : string) {
    aura.radius.unit = unit
  }
  updateColor() {
    
  }
}
