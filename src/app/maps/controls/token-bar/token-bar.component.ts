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
  @Input() item : TokenAnnotation

  @Input() attributes: Attribute[] = []
  @Output() changes = new EventEmitter()

  constructor(private modal : NgbModal) { }

  ngOnInit() {
    
  }

  add() {
    this.item.bars.push(new TokenBar())
    this.emitChanges() 
  }

  delete(bar : TokenBar) {
    const indx = this.item.bars.indexOf(bar)
    if (indx >= 0 ) {
      this.item.bars.splice(indx, 1)
      this.emitChanges() 
    } else {
      // SHOW ERROR and RECORD
    }
  }

  edit(bar :TokenBar) {
    TokenBarEditComponent.openDialog(this.modal, bar, this.attributes).subscribe( updated => {
      this.emitChanges() 
    })
  }

  toggle(bar: TokenBar, event) {
    const reverse = event.ctrlKey

    if (bar.visible == AuraVisible.NotVisible) {
      bar.visible = reverse ? AuraVisible.OnSelect : AuraVisible.Visible
    } else if (bar.visible == AuraVisible.Visible) {
      bar.visible = reverse ? AuraVisible.NotVisible : AuraVisible.OnSelect
    } else if (bar.visible == AuraVisible.OnSelect) {
      bar.visible = reverse ? AuraVisible.Visible : AuraVisible.NotVisible
    }

    this.emitChanges() 
  }

  emitChanges() {
    this.changes.emit()
  }
}
