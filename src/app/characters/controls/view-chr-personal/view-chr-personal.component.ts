import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../../../models/character';

@Component({
  selector: 'app-view-chr-personal',
  templateUrl: './view-chr-personal.component.html',
  styleUrls: ['./view-chr-personal.component.css']
})
export class ViewChrPersonalComponent implements OnInit {
  @Input() character: Character
  constructor() { }

  ngOnInit() {
  }

}
