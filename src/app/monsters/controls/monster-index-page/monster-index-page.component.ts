import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MonsterIndex, MonsterDB } from '../../../models/monsterdb';
import { DataService } from '../../../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { splitStringBySize } from '@firebase/database/dist/src/core/util/util';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { debounce, tap, throttleTime, debounceTime, auditTime } from 'rxjs/operators';
import { SearchBarComponent } from '../../../controls/search-bar/search-bar.component';
import { SortFilterField } from '../../../util/sort-filter';
import { GameSystem, Game } from '../../../models';

@Component({
  selector: 'app-monster-index-page',
  templateUrl: './monster-index-page.component.html',
  styleUrls: ['./monster-index-page.component.css']
})
export class MonsterIndexPageComponent implements OnInit {
  @ViewChild('list') listElement: ElementRef
  @ViewChild('search') search: SearchBarComponent
  type = MonsterIndex.TYPE
  gameid: string
  gsid: string
  game: Game
  gamesystem: GameSystem;


  cnt = 0;
  filtered: MonsterIndex[] = []
  all: MonsterIndex[] = []
  loading = false
  startAt = null

  fields: SortFilterField[] = [
    { name: 'Name', valueFn: (item) => item.name, indexFn: (item) => item.name.substr(0, 1).toUpperCase(), sort: true, text: true },
    { name: 'Type', valueFn: (item) => item.type, indexFn: (item) => item.type, sort: true, text: true, filter: true },
    { name: 'CR', valueFn: (item) => MonsterDB.crToNumber(item.cr), indexFn: (item) => item.cr, formatFn: (value) => MonsterDB.formatCR(value), sort: true, text: true, filter: true }
  ]
  constructor(private data: DataService, private route: ActivatedRoute, private router: Router) {

  }

  updateItems(newItems: MonsterIndex[]) {
    this.filtered = newItems
  }

  ngOnInit() {
    this.data.gameAssets.monsters.items$.pipe().subscribe(a => {
      this.all = a
      if (this.search) {
        this.search.applyFilters()
      }
    })
    // this.data.monstersLoading.subscribe(v => {
    //   this.loading = v
    // })
    this.data.game.subscribe(g => this.game = g)

    this.route.paramMap.subscribe(p => {
      this.gameid = p.get("gameid")
      this.gsid = p.get("gsid")
      if (this.gameid) {
        this.data.setCurrentGame(this.gameid)
      } else if (this.gsid) {
        this.gamesystem = this.data.gamesystems.value.find(g => g.id == this.gsid)
      }
    })
  }

  goto(m: MonsterIndex) {
    this.router.navigate(['monster', m.id])
  }


  scrollTo($event: MonsterIndex) {
    console.log("REceived Scroll Request", $event);

    if (this.listElement) {
      console.log("Scrolling to ", $event.id);
      this.listElement.nativeElement.querySelector("#MONSTER_" + $event.id).scrollIntoView()
    }
  }
}
