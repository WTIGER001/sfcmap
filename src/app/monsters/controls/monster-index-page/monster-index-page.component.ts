import { Component, OnInit } from '@angular/core';
import { MonsterIndex, MonsterDB } from '../../../models/monsterdb';
import { DataService } from '../../../data.service';
import { Router } from '@angular/router';
import { splitStringBySize } from '@firebase/database/dist/src/core/util/util';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { debounce, tap, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-monster-index-page',
  templateUrl: './monster-index-page.component.html',
  styleUrls: ['./monster-index-page.component.css']
})
export class MonsterIndexPageComponent implements OnInit {
  sort = 'name'
  cnt = 0;
  sortDir = 1
  filtered: MonsterIndex[] = []
  all: MonsterIndex[] = []
  filtered$ = new ReplaySubject<MonsterIndex>()
  loading = false
  startAt = null

  filter$ = new BehaviorSubject<string>('')

  set filter(f: string) {
    this.filter$.next(f)
  }

  get filter(): string {
    return this.filter$.getValue()
  }

  constructor(private data: DataService, private router: Router) {

  }

  ngOnInit() {
    this.data.monsters.pipe(throttleTime(2000)).subscribe(a => {
      console.log("Got some data");

      this.all = a
      this.applyFilter()
    })
    this.data.monstersLoading.subscribe(v => {
      this.loading = v
    })
    this.filter$.pipe(throttleTime(700)).subscribe(txt => {
      console.log("In Observable");
      this.applyFilter()
    })
  }

  noFilter() {
    this.filtered = this.all
  }

  applyFilter() {
    console.log("Applying filter");

    let temp: MonsterIndex[] = []
    if (this.filter && this.filter.length > 0) {
      temp = this.all.filter(a => this.matchesFilter(a))
    } else {
      temp = this.all
    }
    this.sortArr(temp)
  }

  matchesFilter(a: MonsterIndex): boolean {
    return MonsterDB.matchesFilter(a, this.filter)
  }

  sortArr(temp: MonsterIndex[]) {
    temp.sort((a, b) => this.sortDir * MonsterDB.compare(a, b, this.sort))
    this.filtered = temp
  }

  updateFilter(text: string) {
    this.filter = text
    // this.applyFilter()
  }

  sortBy(type: string) {
    if (this.sort == type) {
      this.sortDir = this.sortDir == 1 ? -1 : 1
    } else {
      this.sort = type
      this.sortDir = 1
    }
    this.sortArr(this.filtered)
  }

  goto(m: MonsterIndex) {
    this.router.navigate(['monster', m.id])
  }
}
