import { Component, OnInit } from '@angular/core';
import { Game, User } from '../../../models';
import { DataService } from '../../../data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-index',
  templateUrl: './game-index.component.html',
  styleUrls: ['./game-index.component.css']
})
export class GameIndexComponent implements OnInit {
  gameid: string
  games: Game[] = []
  user: User;
  constructor(private data: DataService, private route : ActivatedRoute) {

  }

  ngOnInit() {
    this.data.user.subscribe(u => this.user = u)
    this.data.games.subscribe(a => this.games = a)
    this.data.game.next(undefined)

    this.route.paramMap.subscribe(p => {
      this.gameid = p.get("gameid")
      if (this.gameid) {
        this.data.setCurrentGame(this.gameid)
      }
    })
  }

  logout() {

  }

}
