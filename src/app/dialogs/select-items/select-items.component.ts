import { Component, AfterContentInit, Input, Output, EventEmitter } from '@angular/core';
import { Asset } from 'src/app/models';
import { ReplaySubject, Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { isArray } from 'util';
import { LangUtil } from 'src/app/util/LangUtil';

@Component({
  selector: 'app-select-items',
  templateUrl: './select-items.component.html',
  styleUrls: ['./select-items.component.css']
})
export class SelectItemsComponent implements AfterContentInit {

  result = new ReplaySubject(1)
  @Input() _selected = []
  @Input() _choices = []
  @Input() selected : Asset[] | Observable<Asset[]> = []
  @Input() choices: Asset[] | Observable<Asset[]> = []

  constructor(private dialog : NgbActiveModal) {

  }

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
      this.choices.subscribe( items => this._choices = items)
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
    return this._selected.includes(item)
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

}
