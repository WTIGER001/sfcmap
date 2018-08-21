import { Component, OnInit, Input } from '@angular/core';
import { GameSystem } from '../../../models';

@Component({
  selector: 'app-gamesystem-card',
  templateUrl: './gamesystem-card.component.html',
  styleUrls: ['./gamesystem-card.component.css']
})
export class GamesystemCardComponent implements OnInit {
  @Input() gs: GameSystem
  @Input() size: string = 'card'
  constructor() { }

  ngOnInit() {
  }

}
