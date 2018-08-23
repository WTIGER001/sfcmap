import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../../models';
import { DataService } from '../../../data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  styleUrls: ['./game-edit.component.css']
})
export class GameEditComponent implements OnInit {
  game: Game
  constructor(private data: DataService, private route: ActivatedRoute, private router: Router) {
    this.game = new Game()
    this.game.name = "New Game"
    this.game.players = [this.data.user.getValue().uid]
    this.game.gms = [this.data.user.getValue().uid]
    this.game.system = 'pathfinder'

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id')
      let edit = params.get('edit')

      if (id) {
        this.data.games.subscribe(all => {
          let item = all.find(c => c.id == id)
          if (item) {
            this.game = item
          }
        })
      }
    })
  }

  cancel() {

  }

  save() {
    this.data.save(this.game)
    this.router.navigate(['/game', this.game.id])
  }

  delete() {

  }

  setPicture($event) {
    this.game.image = $event.url
  }
}
