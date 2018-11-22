import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenBarEditComponent } from '../token-bar-edit/token-bar-edit.component';
import { TokenBar, Attribute, TokenAnnotation } from 'src/app/models';
import { AuraVisible } from 'src/app/models/aura';

@Component({
  selector: 'app-token-bar',
  templateUrl: './token-bar.component.html',
  styleUrls: ['./token-bar.component.css']
})
export class TokenBarComponent implements OnInit {
  @Input() item: TokenAnnotation

  @Input() attributes: Attribute[] = []
  @Output() changes = new EventEmitter()

  constructor(private modal: NgbModal) { }

  ngOnInit() {

  }

  add() {
    TokenBarEditComponent.openDialog(this.modal, new TokenBar(), this.attributes).subscribe(updated => {
      this.item.bars.push(updated)
      this.emitChanges()
    })
  }

  delete(bar: TokenBar) {
    const indx = this.item.bars.indexOf(bar)
    if (indx >= 0) {
      this.item.bars.splice(indx, 1)
      this.emitChanges()
    } else {
      // SHOW ERROR and RECORD
    }
  }

  edit(bar: TokenBar) {
    TokenBarEditComponent.openDialog(this.modal, bar, this.attributes).subscribe(updated => {
      this.emitChanges()
    })
  }

  update() {
    this.emitChanges()
  }

  setBarVisible(bar: TokenBar, visible: number) {
    bar.visible = visible
    this.changes.emit()
  }

  emitChanges() {
    this.changes.emit()
  }

  toNumber(val: string): number {
    if (val.indexOf('.') >= 0) {
      return parseFloat(val)
    } else {
      return parseInt(val)
    }
  }

  updateBarValue(bar: TokenBar, value) {
    if (this.canAddSub(value)) {
      bar.value = this.toNumber(value) + bar.value
      this.emitChanges()
    } else if (this.isNumber(value)) {
      bar.value = this.toNumber(value)
      this.emitChanges()
    }
  }

  updateBarMax(bar: TokenBar, value) {
    if (this.canAddSub(value)) {
      bar.max = this.toNumber(value) + bar.max
      this.emitChanges()
    } else if (this.isNumber(value)) {
      bar.max = this.toNumber(value)
      this.emitChanges()
    }
  }

  isNumber(value: string | number): boolean {
    return !isNaN(Number(value));
  }

  canAddSub(val: string): boolean {
    return (val.startsWith("+") || val.startsWith('-')) && val.length > 1 && this.isNumber(val.substr(1))
  }

}
