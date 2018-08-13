import { Component, OnInit } from '@angular/core';
import { Character } from '../../../models';
import { BehaviorSubject } from 'rxjs';
import { DataService } from '../../../data.service';
import { Router } from '@angular/router';
import { throttleTime } from 'rxjs/operators';
import { MonsterDB } from '../../../models/monsterdb';

@Component({
  selector: 'app-character-index',
  templateUrl: './character-index.component.html',
  styleUrls: ['./character-index.component.css']
})
export class CharacterIndexComponent implements OnInit {
  sort = 'name'
  cnt = 0;
  sortDir = 1
  filtered: Character[] = []
  all: Character[] = []
  loading = false
  startAt = null
  names = new Map<string, number>()
  types = new Map<string, number>()
  crs = new Map<string, number>()


  filter$ = new BehaviorSubject<string>('')

  set filter(f: string) {
    this.filter$.next(f)
  }

  get filter(): string {
    return this.filter$.getValue()
  }

  constructor(private data: DataService, private router: Router) {

  }

  // find(value: string) {
  //   if (this.sort == 'name') {
  //     return this.filter = "name:$" + value
  //   }
  //   if (this.sort == 'cr') {
  //     return this.filter = "CR" + value
  //   }
  //   if (this.sort == 'type') {
  //     return this.filter = "type:=" + value
  //   }
  // }

  // getIndexButtons() {
  //   if (this.sort == 'name') {
  //     return Array.from(this.names.keys())
  //   }
  //   if (this.sort == 'cr') {
  //     return Array.from(this.crs.keys()).sort((cr1, cr2) => {
  //       const c1 = MonsterDB.crToNumber(cr1)
  //       const c2 = MonsterDB.crToNumber(cr2)
  //       return c1 - c2
  //     })
  //   }
  //   if (this.sort == 'type') {
  //     return Array.from(this.types.keys())
  //   }

  // }

  // calcIndexButtons() {
  //   const b = new Map<string, number>()
  //   this.all.forEach(a => {
  //     this.increment(this.names, a.name.substr(0, 1).toUpperCase())
  //     this.increment(this.crs, a.cr.toUpperCase())
  //     this.increment(this.types, a.type)
  //   })
  // }

  // increment(m: Map<string, number>, key: string) {
  //   if (!m.has(key)) {
  //     m.set(key, 1)
  //   } else {
  //     m.set(key, m.get(key) + 1)
  //   }
  // }

  ngOnInit() {
    this.data.characters.pipe().subscribe(a => {
      console.log("Got some data");
      this.all = a
      this.applyFilter()
    })
    this.data.charactersLoading.subscribe(v => {
      this.loading = v
    })
    this.filter$.pipe(throttleTime(300)).subscribe(txt => {
      this.applyFilter()
    })
  }

  noFilter() {
    this.filtered = this.all
  }

  applyFilter() {
    console.log("Applying filter");

    let temp: Character[] = []
    if (this.filter && this.filter.length > 0) {
      temp = this.all.filter(a => this.matchesFilter(a))
    } else {
      temp = this.all
    }
    this.sortArr(temp)
  }

  matchesFilter(a: Character): boolean {
    return MonsterDB.matchText(a.name, this.filter)
  }

  sortArr(temp: Character[]) {
    temp.sort((a, b) => this.sortDir * this.compare(a, b))
    this.filtered = temp
  }

  compare(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
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


}
