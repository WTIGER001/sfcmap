import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../../../models/character';

@Component({
  selector: 'app-edit-chr-personal',
  templateUrl: './edit-chr-personal.component.html',
  styleUrls: ['./edit-chr-personal.component.css']
})
export class EditChrPersonalComponent implements OnInit {
  sizes = [
    'Small (5x5)', 'Medium (5x5)', 'Large (10x10)', 'Huge (15x15)'
  ]

  visions = [

  ]


  @Input() character: Character

  constructor() { }

  ngOnInit() {
  }

}
