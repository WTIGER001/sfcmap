import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../../models';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent implements OnInit {
  @Input() game: Game
  expanded: false;
  constructor() { }

  ngOnInit() {
  }

}
