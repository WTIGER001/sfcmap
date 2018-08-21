import { Component, OnInit, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { Character, CharacterType } from '../../../models';
import { BehaviorSubject } from 'rxjs';
import { DataService } from '../../../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { throttleTime } from 'rxjs/operators';
import { MonsterDB } from '../../../models/monsterdb';
import { SearchBarComponent } from '../../../controls/search-bar/search-bar.component';
import { SortFilterField } from '../../../util/sort-filter';
import { Location } from '@angular/common';
import { CharacterService } from '../../dialogs/character.service';

@Component({
  selector: 'app-character-index',
  templateUrl: './character-index.component.html',
  styleUrls: ['./character-index.component.css']
})
export class CharacterIndexComponent implements OnInit, AfterContentInit {
  @ViewChild('list') listElement: ElementRef
  @ViewChild('search') search: SearchBarComponent
  view = 'card'
  gameid: string
  filtered: Character[] = []
  all: Character[] = []
  loading = true
  types: CharacterType[] = []

  lookup = (id: string): string => {
    const type = this.types.find(a => a.id == id)
    if (type) {
      return type.name
    }
    return "No Folder"
  }

  compareTypes = (a: string, b: String) => {
    const typea = this.types.find(i => i.name == a)
    const typeb = this.types.find(i => i.name == b)
    if (typea && typeb) {
      return typea.order - typeb.order
    } else if (typea) {
      return 1
    } else if (typeb) {
      return -1
    }
    return 0;
  }

  fields: SortFilterField[] = [
    { name: "Name", sort: true, filter: true, text: true, valueFn: (item) => item.name, indexFn: (item) => item.name.substr(0, 1).toUpperCase() },
    { name: "Folder", sort: true, filter: true, text: true, valueFn: (item) => this.lookup(item.type), indexFn: (item) => this.lookup(item.type), compareFn: this.compareTypes }
  ]

  constructor(private data: DataService, private router: Router, private location: Location, private route: ActivatedRoute, private chrSvc: CharacterService) {

  }

  ngOnInit() {

    this.data.characters.pipe().subscribe(a => {
      this.all = a
      this.loading = false
      if (this.search) {
        this.search.items = a
        this.search.applyFilters()
      }
    })

    this.route.paramMap.subscribe(p => {
      this.gameid = p.get("gameid")
    })

    // this.data.charactersLoading.subscribe(v => {
    //   this.loading = v
    // })

    this.data.characterTypes.subscribe(t => this.types = t)
  }

  ngAfterContentInit() {
    if (this.search) {
      this.search.applyFilters()
    }
  }

  updateItems($event: Character[]) {
    this.filtered = $event
  }

  scrollTo($event: Character) {
    if (this.listElement) {
      this.listElement.nativeElement.querySelector("#CHARACTER" + $event.id).scrollIntoView()
    }
  }

  importCharacter() {
    this.chrSvc.openImport()
  }
}
