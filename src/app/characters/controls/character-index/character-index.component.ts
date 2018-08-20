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

@Component({
  selector: 'app-character-index',
  templateUrl: './character-index.component.html',
  styleUrls: ['./character-index.component.css']
})
export class CharacterIndexComponent implements OnInit, AfterContentInit {
  @ViewChild('list') listElement: ElementRef
  @ViewChild('search') search: SearchBarComponent
  view = 'card'

  filtered: Character[] = []
  all: Character[] = []
  loading = false
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

  constructor(private data: DataService, private router: Router, private location: Location, private route: ActivatedRoute) {

  }

  ngOnInit() {


    this.data.characters.pipe().subscribe(a => {
      console.log("Got some data characters ", a.length);
      this.all = a
      if (this.search) {
        console.log("Sertting Items ", a.length);
        this.search.items = a
        this.search.applyFilters()
      }
    })

    this.data.charactersLoading.subscribe(v => {
      this.loading = v
    })

    this.data.characterTypes.subscribe(t => this.types = t)
  }

  ngAfterContentInit() {
    console.log("Initing View!!!!");

    if (this.search) {
      console.log("applyFilters!!!!");
      this.search.applyFilters()
    }
  }

  updateItems($event: Character[]) {
    console.log("Receiving Updated Items", $event.length);
    this.filtered = $event
  }

  scrollTo($event: Character) {
    if (this.listElement) {
      this.listElement.nativeElement.querySelector("#CHARACTER" + $event.id).scrollIntoView()
    }
  }

}
