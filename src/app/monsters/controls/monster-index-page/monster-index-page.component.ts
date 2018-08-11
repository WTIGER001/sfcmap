import { Component, OnInit } from '@angular/core';
import { MonsterIndex, MonsterDB } from '../../../models/monsterdb';
import { DataService } from '../../../data.service';
import { Router } from '@angular/router';
import { splitStringBySize } from '@firebase/database/dist/src/core/util/util';
import { ReplaySubject } from 'rxjs';
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
  filter: string
  filtered: MonsterIndex[] = []
  all: MonsterIndex[] = []
  filtered$ = new ReplaySubject<MonsterIndex>()
  loading = false
  startAt = null


  constructor(private data: DataService, private router: Router) {

  }

  ngOnInit() {
    this.data.monsters.pipe(throttleTime(500)).subscribe(a => {
      console.log("Got some data");

      this.all = a
      this.applyFilter()
    })
    this.data.monstersLoading.subscribe(v => {
      this.loading = v
    })
    // this.data.getMonsters().pipe(tap(a => {
    //   if (this.all.length % 25 == 0) {
    //     this.applyFilter()
    //     console.log(this.cnt);
    //   }
    // })).subscribe(a => {
    //   // console.log("Add Monsters: ", a.name);
    //   this.all.push(a)
    //   this.cnt++
    // })


    // this.submitNext()
  }


  submitNext() {
    this.loading = true
    this.data.getMonstersPaged(300, this.startAt).subscribe(items => {
      console.log("ITEMS:", items);
      if (items.length > 1) {
        this.startAt = items[items.length - 1].id
        this.submitNext()
      } else {
        this.applyFilter()
        this.loading = false
      }
      this.all.push(...items.slice(0, 300))
      this.noFilter()

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
    this.applyFilter()
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
