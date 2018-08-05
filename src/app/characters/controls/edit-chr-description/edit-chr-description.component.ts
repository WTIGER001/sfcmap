import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../../../models/character';

@Component({
  selector: 'app-edit-chr-description',
  templateUrl: './edit-chr-description.component.html',
  styleUrls: ['./edit-chr-description.component.css']
})
export class EditChrDescriptionComponent implements OnInit {
  @Input() character: Character
  constructor() { }

  ngOnInit() {
  }

}
