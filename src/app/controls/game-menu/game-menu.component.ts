import { Component, OnInit } from '@angular/core';
import { Game } from '../../models';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.css']
})
export class GameMenuComponent implements OnInit {
  gameid
  gamesytemid
  expanded = false
  game: Game
  games: Game[] = []

  constructor(data: DataService, private router: Router) {
    data.games.subscribe(g => {
      this.games = g
      this.setIds();
    })
  }

  private setIds() {
    if (this.gameid) {
      this.game = this.games.find(gm => gm.id == this.gameid);
      if (this.game) {
        this.gamesytemid = this.game.system;
      }
    }
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.parse((<NavigationEnd>event).url)
    })

    this.parse(this.router.url)
  }

  parse(url: string) {
    console.log("PARSING URL ", url);

    const parts = url.split('/')
    if (parts[1] == 'game') {
      if (parts[2]) {
        this.gameid = parts[2]
        this.setIds()
      }
    } else if (parts[1] == 'gs') {
      if (parts[2]) {
        if (this.gamesytemid != parts[2]) {
          this.gameid = undefined
        }
        this.gamesytemid = parts[2]
      }
    } else {
      console.log("Not a Game Or Game System URL: ", url);
    }
  }

  toggleMenu() {
    this.expanded = !this.expanded
  }
}
