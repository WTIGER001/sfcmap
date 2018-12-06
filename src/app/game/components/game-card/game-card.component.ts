import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../../models';
import { Assets } from 'src/app/assets';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent implements OnInit {
  @Input() game: Game
  expanded = false;
  constructor() { }

  ngOnInit() {
  }

  getLogo() : string {
    return Assets.PathfinderLogo
  }
  
  https(val : string) : string {
    if (val && val.startsWith("http:"))  {
      return "https" + val.substr(4)
    }
    return val
  }
}
