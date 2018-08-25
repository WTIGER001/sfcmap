import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Game } from '../../../models';
import { Encounter } from '../../model/encounter';
import { SortFilterField } from '../../../util/sort-filter';
import { DataService } from '../../../data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-encounter-index',
  templateUrl: './encounter-index.component.html',
  styleUrls: ['./encounter-index.component.css']
})
export class EncounterIndexComponent implements OnInit {
  @ViewChild('list') listElement: ElementRef

  gameid: string = 'unk'
  game: Game
  all: Encounter[] = []
  filtered: Encounter[] = []
  view = 'card'

  fields: SortFilterField[] = [
    { name: "Name", sort: true, filter: true, text: true, valueFn: (item) => item.name, indexFn: (item) => item.name.substr(0, 1).toUpperCase() },
  ]

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
    this.data.gameAssets.encounters.items$.subscribe(m => {
      console.log("GOT MAPS: ", m);
      this.all = m
      this.filtered = m
    })
  }

  updateItems($event: Encounter[]) {
    this.filtered = $event
  }

  scrollTo($event: Encounter) {
    if (this.listElement) {
      this.listElement.nativeElement.querySelector("#ENCOUNTER_" + $event.id).scrollIntoView()
    }
  }
}
