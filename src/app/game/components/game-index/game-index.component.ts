import { Component, OnInit } from '@angular/core';
import { Game, User } from '../../../models';
import { DataService } from '../../../data.service';

@Component({
  selector: 'app-game-index',
  templateUrl: './game-index.component.html',
  styleUrls: ['./game-index.component.css']
})
export class GameIndexComponent implements OnInit {

  games: Game[] = []
  user: User;
  constructor(private data: DataService) {

  }

  ngOnInit() {
    this.data.user.subscribe(u => this.user = u)
    this.data.games.subscribe(a => this.games = a)
    this.data.game.next(undefined)
  }

  logout() {

  }

}
