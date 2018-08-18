import { Component, OnInit } from '@angular/core';
import { Game } from '../../models';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.css']
})
export class GameMenuComponent implements OnInit {
  gameid = "unk"
  gamesytemid = "unk2"
  expanded = false
  game: Game
  constructor(data: DataService) {
    data.game.subscribe(a => {
      this.game = a
      this.gameid = a.id
      this.gamesytemid = a.system
    })
  }

  ngOnInit() {
  }

  toggleMenu() {
    this.expanded = !this.expanded
  }
}
