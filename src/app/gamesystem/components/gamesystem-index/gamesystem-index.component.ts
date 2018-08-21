import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../../data.service';
import { GameSystem } from '../../../models';
import { SortFilterField } from '../../../util/sort-filter';
import { SearchBarComponent } from '../../../controls/search-bar/search-bar.component';

@Component({
  selector: 'app-gamesystem-index',
  templateUrl: './gamesystem-index.component.html',
  styleUrls: ['./gamesystem-index.component.css']
})
export class GamesystemIndexComponent implements OnInit {
  @ViewChild('list') listElement: ElementRef
  @ViewChild('search') search: SearchBarComponent
  all: GameSystem[] = []
  filtered: GameSystem[] = []
  view = 'card'

  constructor(private data: DataService) { }

  fields: SortFilterField[] = [
    { name: "Name", sort: true, filter: true, text: true, valueFn: (item) => item.name, indexFn: (item) => item.name.substr(0, 1).toUpperCase() },
    { name: "Tag", sort: true, filter: true, text: true, valueFn: (item) => item.tags, indexFn: (item) => item.tags }
  ]

  ngOnInit() {
    this.data.gamesystems.subscribe(items => {
      console.log("GOT GAMESYSTEMS", items);

      this.all = items;
      if (this.search) {
        this.search.items = items;
        this.search.applyFilters()
      }
    })
  }

  updateItems(items: GameSystem[]) {
    this.filtered = items
  }

}
