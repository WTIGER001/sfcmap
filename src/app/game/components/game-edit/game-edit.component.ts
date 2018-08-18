import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../../models';
import { DataService } from '../../../data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  styleUrls: ['./game-edit.component.css']
})
export class GameEditComponent implements OnInit {
  game: Game
  constructor(private data: DataService, private route: ActivatedRoute) {
    this.game = new Game()
    this.game.name = "New Game"
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
  }

  delete() {

  }

  setPicture($event) {
    this.game.image = $event.url
  }
}
