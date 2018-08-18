import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../data.service';
import { ActivatedRoute } from '@angular/router';
import { Game, MapConfig } from '../../../models';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-map-index',
  templateUrl: './map-index.component.html',
  styleUrls: ['./map-index.component.css']
})
export class MapIndexComponent implements OnInit {
  gameid: string = 'unk'
  game: Game
  all: MapConfig[] = []
  filtered: MapConfig[] = []
  view = 'card'

  constructor(private data: DataService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let id = params.get('gameid')
      this.gameid = id;
      if (id) {
        this.data.games.subscribe(all => {
          let item = all.find(c => c.id == id)
          if (item) {
            this.game = item
            this.data.game.next(item)
          }
        })
      }
    })
    this.data.maps.subscribe(m => {
      console.log("GOT MAPS: ", m);
      this.all = m
      this.filtered = m
    })
  }

  updateItems($event: MapConfig[]) {
    this.filtered = $event
  }
}
