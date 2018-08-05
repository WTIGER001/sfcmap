import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../../../models/character';

@Component({
  selector: 'app-view-chr-description',
  templateUrl: './view-chr-description.component.html',
  styleUrls: ['./view-chr-description.component.css']
})
export class ViewChrDescriptionComponent implements OnInit {
  @Input() character: Character
  constructor() { }

  ngOnInit() {
  }

}
