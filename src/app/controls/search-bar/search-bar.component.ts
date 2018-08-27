import { Component, OnInit, Input, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isArray } from 'util';
import { DialogService } from '../../dialogs/dialog.service';
import { distinctUntilChanged, throttleTime } from 'rxjs/operators';
import { SortFilterUtil, SortFilterData, SortFilterField } from '../../util/sort-filter';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RouteUtil } from '../../util/route-util';
import { Game } from '../../models';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, AfterContentInit {
  search$ = new BehaviorSubject<string>('')
  view: string = ''
  filter = new SortFilterData()

  @Output() viewChanged = new EventEmitter()
  @Output() sortChanged = new EventEmitter()
  @Output() filterChanged = new EventEmitter()
  @Output() searchChanged = new EventEmitter()
  @Output() itemsUpdated = new EventEmitter()
  @Output() scrollRequest = new EventEmitter()
  @Output() clickImport = new EventEmitter()

  @Input() hasIndex = true
  @Input() hasViews = true
  @Input() hasFilters = true
  @Input() hasSorts = true
  @Input() hasNew = true
  @Input() hasImport = true
  @Input() hasLinks = true
  @Input() fields: SortFilterField[] = []
  @Input() newText = "New Item"
  @Input() newLink = "/new-item"
  @Input() submitOnChange = false
  @Input() views: string[] = ['card', 'small'] //, 'line'
  @Input() viewIcons: string[] = ['th-large', 'th', 'th-list']

  @Input() game: Game
  @Input() type: string

  filtered: any[] = []
  _items: any[] = []

  @Input() set searchPhrase(s: string) {
    this.search$.next(s)
  }

  get searchPhrase(): string {
    return this.search$.getValue()
  }

  @Input() set items(s: any[]) {
    this._items = s
    this.processFilterValues()
  }

  get items(): any[] {
    return this._items;
  }

  constructor(private dialog: DialogService, private router: Router, private location: Location, private route: ActivatedRoute, private data: DataService) { }

  ngOnInit() {
    this.search$.pipe(
      distinctUntilChanged(),
      throttleTime(250)
    ).subscribe(text => {
      this.filter.textfilter = text
      this.applyFilters()
    })
  }

  getViewIcon() {
    let indx = this.views.indexOf(this.view)
    return this.viewIcons[indx]
  }

  ngAfterContentInit() {
    this.processFilterValues();

    this.view = this.views[0]
    this.route.queryParamMap.subscribe(p => {
      const v = p.get("view")
      if (v) {
        this.view = v;
        this.viewChanged.emit(this.view)
      }
    })
  }

  clkImport() {
    this.clickImport.emit()
  }

  clkLinks() {
    // if (this.game && this.type) {
    this.dialog.openLinks(this.game, this.type).subscribe(result => {
      if (result) {
        console.log("UPDATED LINKS!!!");

        // Save the game
        this.data.save(this.game)

      }
    })
    // }
  }

  processFilterValues() {
    this.filter.fields = this.fields
    this.filter.calcFilterValues(this._items);
  }

  toggleView() {
    let indx = this.views.indexOf(this.view)
    if (indx == -1 && this.views && this.views.length > 0) {
      indx = 0
    } else if (indx == this.views.length - 1) {
      indx = 0
    } else {
      indx = indx + 1
    }
    this.view = this.views[indx]
    RouteUtil.setParamsNoReload(this.router, this.location, { view: this.view })
    this.viewChanged.emit(this.view)
  }

  toggleSort() {
    this.dialog.openSort(this.filter).subscribe(s => {
      this.filter = s
      this.applyFilters()
    })
  }

  toggleFilter() {
    this.dialog.openFilter(this.filter).subscribe(f => {
      this.filter = f
      this.applyFilters()
    })
  }

  applyFilters() {
    this.filtered = SortFilterUtil.sortAndFilter(this._items, this.filter)
    this.itemsUpdated.emit(this.filtered)
  }

  updateSearch($event: string) {
    console.log("Updating : ", this.submitOnChange, $event);

    if (this.submitOnChange) {
      this.searchPhrase = $event
    }
  }

  forceUpdateSearch($event) {
    this.searchPhrase = $event.target.value
  }

  clearSearch() {
    this.searchPhrase = ''
  }

  goto(indexValue) {
    console.log("GOTO ", indexValue);

    let first = this.filtered.find(item => this.filter.sortField.indexFn(item) == indexValue)
    console.log("FIRST FIND  ", first);

    if (first) {
      this.scrollRequest.emit(first)
    }
  }

  showFilterHelp() {

  }

}