import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Game } from '../../../models';
import { SearchBarComponent } from '../../../controls/search-bar/search-bar.component';
import { Item } from '../../item';
import { SortFilterField } from '../../../util/sort-filter';
import { DataService } from '../../../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemImport } from '../../item-csv-import';

@Component({
  selector: 'app-item-index',
  templateUrl: './item-index.component.html',
  styleUrls: ['./item-index.component.css']
})
export class ItemIndexComponent implements OnInit {
  @ViewChild('list') listElement: ElementRef
  @ViewChild('list2') list2Element: ElementRef
  @ViewChild('search') search: SearchBarComponent
  @ViewChild('file') file: ElementRef
  view = 'list'
  gameid: string
  game: Game
  filtered: Item[] = []
  all: Item[] = []
  loading = true
  type = Item.TYPE

  columns=[]

  fields: SortFilterField[] = [
    { name: "Name", sort: true, filter: false, text: true, valueFn: (item) => item.name, indexFn: (item) => item.name.substr(0, 1).toUpperCase(), propName:'name' },
    { name: "Group", sort: true, filter: true, text: true, valueFn: (item) => item.group, indexFn: (item) => item.group, propName: 'group'  },
    { name: "Slot", sort: true, filter: true, text: true, valueFn: (item) => item.slot, indexFn: (item) => item.slot, propName: 'slot'  },
    { name: "Source", sort: true, filter: true, text: true, valueFn: (item) => item.source, indexFn: (item) => item.source, propName: 'source'  },
    { name: "Price", sort: true, filter: false, text: false, valueFn: (item) => item.priceValue, indexFn: (item) => item.priceValue, propName: 'priceValue' }
  ]

  constructor(private data: DataService, private router: Router, private route: ActivatedRoute) {
    this.makeColumns()
  }

  makeColumns() {
    this.columns = this.fields.map( f => {
      let c : any= {}
      c.name = f.name
      c.prop = f.propName
      c.resizable = true
      c.sortable = true
      c.draggable = true
      c.comparator = f.compareFn
      return c
    })
  }

  ngOnInit() {
    this.data.gameAssets.items.items$.subscribe(a => {
      this.all = a
      this.loading = false
      if (this.search) {
        this.search.items = a
        this.search.applyFilters()
      }
    })

    this.data.game.subscribe(g => this.game = g)
  }

  ngAfterContentInit() {
    if (this.search) {
      this.search.applyFilters()
    }
  }

  updateItems($event: Item[]) {
    this.filtered = $event
  }

  scrollTo($event: Item) {
    console.log("SCROLL TO ", $event);
    if (this.listElement) {
      this.listElement.nativeElement.querySelector("#ITEM_" + $event.id).scrollIntoView()
    }
  }

  importItem() {
    this.file.nativeElement.click()
  }

  importFile(event) {
    console.log("LOADING FILE", event);
    const files: FileList = event.target.files
    if (files && files.length > 0) {
      console.log("FOUND FILES", files.item(0));
      const f: File = files.item(0)
      const imp = new ItemImport()
      imp.load(f, true, 10, 300).then( items => {
        items.forEach(item => console.log(item))
        items.forEach(item => item.owner = this.data.game.value.id)
        this.data.saveAll(...items)
      })
    } else {
      console.log("NO FILES");

    }
  }
}
