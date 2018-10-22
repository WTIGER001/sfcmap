import { Component, AfterContentInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Asset } from 'src/app/models';
import { ReplaySubject, Observable, Subject, BehaviorSubject } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isArray } from 'util';
import { LangUtil } from 'src/app/util/LangUtil';
import { FocusItemCmd } from 'od-virtualscroll';
import { SortFilterField } from 'src/app/util/sort-filter';
import { SearchBarComponent } from 'src/app/controls/search-bar/search-bar.component';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-select-items',
  templateUrl: './select-items.component.html',
  styleUrls: ['./select-items.component.css']
})
export class SelectItemsComponent implements AfterContentInit {
  @ViewChild('search') search: SearchBarComponent

  result = new ReplaySubject(1)
  @Input() _selected = []
  @Input() _choices = []
  @Input() selected : Asset[] | Observable<Asset[]> = []
  @Input() choices: Asset[] | Observable<Asset[]> = []
  @Input() showSearch = true

  @Input() fields : SortFilterField[] = [
    { name: 'Name', valueFn: (item) => item.name, indexFn: (item) => item.name.substr(0, 1).toUpperCase(), sort: true, text: true },
  ]

  filtered: any[] = []

  data$ = new ReplaySubject<any[]>(1)
  options$ = new BehaviorSubject<any>({ itemWidth: 115, itemHeight: 155, numAdditionalRows: 1 })
  cmd$ = new Subject()

  constructor(private dialog : NgbActiveModal) {

  }
  
  // ----------------------------------------------------------------------------------------------
  // Search Bar Support
  // ----------------------------------------------------------------------------------------------

  updateItems(newItems: any[]) {
    console.log("Updating Items ", newItems.length);
    this.filtered = newItems
    this.data$.next([])
    this.data$.next(this.filtered)
  }

  scrollTo($event) {
    console.log("Scrolling to ", $event.id);
    const index = this.filtered.indexOf($event)
    if (index >= 0) {
      this.cmd$.next(new FocusItemCmd(index))
    }
  }

  // ----------------------------------------------------------------------------------------------

  getImagePosClass(item) {
    if (item.imagePos && item.imagePos >0) {
      return "object-position-" + item.imagePos
    } else {
      return "object-position-5"
    }
  }

  ngAfterContentInit() {
    if (isArray(this.selected)) {
      this._selected = this.selected.slice()
    } else {
      this.selected.subscribe(items => this._selected = items)
    }

    if (isArray(this.choices)) {
      this._choices = this.choices.slice()
    } else {
      this.choices.pipe(
        tap( items => this._choices = items),
        tap( items => {
          if (this.search) {
            this.search.items = items
            this.search.applyFilters()
          }
        })
      ).subscribe()
    }
  }


  checkChange($event, item: Asset) {
    let indx = this._selected.indexOf(item)
    if (indx >= 0) {
      this._selected.splice(indx, 1)
    } else {
      this._selected.push(item)
    }
  }

  toggleSelection(item : Asset) {
    let indx = this._selected.indexOf(item)
    if (indx >= 0 ) {
      this._selected.splice(indx, 1)
    } else {
      this._selected.push(item)
    }
  }

  isSelected(item : Asset) {
    try {
      return this._selected.includes(item)
    } catch (err) {
      console.log(err)
    }
    return false
  }

  getImage(item) : string{
    return LangUtil.firstDefined(item.thumb, item.image, item.picture, item.token,'./assets/missing.png')
  }

  ok() {
    this.selected = this._selected
    this.result.next(this._selected)
    this.cancel()
  }

  cancel() {
    this.result.complete()
    this.dialog.dismiss()
  }

  public static openDialog(modalSvc: NgbModal, choices: Asset[] | Observable<Asset[]>, options ?: ISelectOptions): Observable<Asset[]> {
    const modalRef = modalSvc.open(SelectItemsComponent);
    modalRef.componentInstance.result = new Subject<Asset[]>()
    modalRef.componentInstance.choices = choices

    if (options) {
      if (options.fields) {
        modalRef.componentInstance.fields = options.fields
      }
    }

    return modalRef.componentInstance.result
  }

}

export interface ISelectOptions {
  numberAllowed?: number
  currentSelection?: Asset[]
  fields?: SortFilterField[] 
}
