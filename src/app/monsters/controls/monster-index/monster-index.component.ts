import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FocusItemCmd } from 'od-virtualscroll';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { SearchBarComponent } from '../../../controls/search-bar/search-bar.component';
import { DataService } from '../../../data.service';
import { Game, GameSystem } from '../../../models';
import { SortFilterField } from '../../../util/sort-filter';
import { Monster } from '../../monster';


@Component({
  selector: 'app-monster-index',
  templateUrl: './monster-index.component.html',
  styleUrls: ['./monster-index.component.css']
})
export class MonsterIndexComponent implements OnInit {
  
  @ViewChild('list') listElement: ElementRef
  @ViewChild('search') search: SearchBarComponent

  type = Monster.TYPE
  gameid: string
  gsid: string
  game: Game
  gamesystem: GameSystem;
  view: string = 'card'

  cnt = 0;
  filtered: Monster[] = []
  paged: Monster[] = []
  all: Monster[] = []
  loading = false
  startAt = null

  data$ = new ReplaySubject<Monster[]>(1)
  options$ = new BehaviorSubject<any>({ itemWidth: 225, itemHeight: 315, numAdditionalRows: 1 })
  cmd$ = new Subject()

  fields: SortFilterField[] = Monster.FIELDS
  
  constructor(private data: DataService, private route: ActivatedRoute, private router: Router) {
  }

  updateView(newview : string) {
    if (newview == 'list') {
      newview = 'card'
    }

    if (newview == 'card') {
      this.options$.next({ itemWidth: 225, itemHeight: 315, numAdditionalRows: 1 })
    } else if (newview == 'small') {
      this.options$.next({ itemWidth: 135, itemHeight: 185, numAdditionalRows: 3 })
    }
    this.view = newview

    this.data$.next([])
    this.data$.next(this.filtered)
  }

  updateItems(newItems: Monster[]) {
    console.log("Updating Items ", newItems.length);
    this.filtered = newItems
    this.data$.next([])
    this.data$.next(this.filtered)
  }

  ngOnInit() {
    // this.data.gameAssets.monsters.items$.pipe().subscribe(a => {
    this.data.pathfinder.monsters$.pipe().subscribe(a => {
      this.all = a
      if (this.search) {
        this.search.items = a
        this.search.applyFilters()
      }
    })

    this.data.game.subscribe(g => this.game = g)
  }

  goto(m: Monster) {
    this.router.navigate(['monster', m.id])
  }

  scrollTo($event: Monster) {
    console.log("Scrolling to ", $event.id);
    const index = this.filtered.indexOf($event)
    if (index >= 0) {
      this.cmd$.next(new FocusItemCmd(index))
    }
  }

}
