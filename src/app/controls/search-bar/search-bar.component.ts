import { Component, OnInit, Input, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isArray } from 'util';
import { DialogService } from '../../dialogs/dialog.service';
import { SortData } from '../../models';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, AfterContentInit {
  search$ = new BehaviorSubject<string>('')
  view: string = ''
  filterValues = new Map<string, Map<string, number>>()
  sort: SortData

  @Output() viewChanged = new EventEmitter()
  @Output() sortChanged = new EventEmitter()
  @Output() filterChanged = new EventEmitter()
  @Output() searchChanged = new EventEmitter()

  @Input() hasViews = true
  @Input() hasFilters = true
  @Input() hasSorts = true
  @Input() filterFields: string[] = []
  @Input() sortFields: string[] = []
  @Input() newText = "New Item"
  @Input() newLink = "/new-item"
  @Input() submitOnChange = false
  @Input() views: string[] = ['card', 'small'] //, 'line'
  @Input() viewIcons: string[] = ['th-large', 'th', 'th-list']

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


  constructor(private dialog: DialogService) { }

  ngOnInit() {
  }

  getViewIcon() {
    let indx = this.views.indexOf(this.view)
    return this.viewIcons[indx]
  }

  ngAfterContentInit() {
    this.processFilterValues();
    this.view = this.views[0]
  }

  processFilterValues() {
    console.log("Fields ", this.filterFields);

    // Get all the filter values
    this.filterValues.clear()
    this.filterFields.forEach(filterField => {
      console.log("Processing ", filterField);

      const valMap = new Map<string, number>()
      this._items.forEach(item => {
        const v = item[filterField]
        console.log("Checking Value ", v);

        if (isArray(v)) {
          v.forEach(v2 => {
            if (valMap.has(v2)) {
              valMap.set(v2, valMap.get(v2) + 1)
            } else {
              valMap.set(v2, 1)
            }
          })
        } else {
          if (valMap.has(v)) {
            valMap.set(v, valMap.get(v) + 1)
          } else {
            valMap.set(v, 1)
          }
        }

        console.log("Map Now ", valMap);
      })
      this.filterValues.set(filterField, valMap)
    })
    console.log("Processed Items ", this.items, this.filterValues);
  }

  toggleView() {
    console.log("Toggling View");

    let indx = this.views.indexOf(this.view)
    if (indx == -1 && this.views && this.views.length > 0) {
      indx = 0
    } else if (indx == this.views.length - 1) {
      indx = 0
    } else {
      indx = indx + 1
    }
    this.view = this.views[indx]
    this.viewChanged.emit(this.view)
    console.log("View: ", this.view);

  }

  toggleSort() {
    this.dialog.openSort(this.sortFields, this.sort).subscribe(s => {
      this.sort = s
      this.applyFilers()
    })
  }

  toggleFilter() {

  }


  applyFilers() {

  }

  updateSearch($event: string) {
    if (this.submitOnChange) {
      this.searchPhrase = $event
    }
  }

  clearSearch() {
    this.searchPhrase = ''
  }

}