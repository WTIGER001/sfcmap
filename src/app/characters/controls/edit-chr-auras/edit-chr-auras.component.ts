import { Component, OnInit, Input, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { Character, TokenAnnotation } from 'src/app/models';
import { Aura, AuraVisible } from 'src/app/models/aura';
import { DistanceUnit } from 'src/app/util/transformation';
import { parseIntAutoRadix } from '@angular/common/src/i18n/format_number';
import { AuraEditComponent } from 'src/app/maps/controls/aura-edit/aura-edit.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-chr-auras',
  templateUrl: './edit-chr-auras.component.html',
  styleUrls: ['./edit-chr-auras.component.css']
})
export class EditChrAurasComponent implements OnInit, AfterContentInit {
  @Input() item: Character | TokenAnnotation
  units: DistanceUnit[] = DistanceUnit.units
  allvisible = AuraVisible.Visible

  @Output() changes = new EventEmitter()

  constructor(private modal: NgbModal) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.updateToggles()
  }

  addRow() {
    AuraEditComponent.openDialog(this.modal, new Aura()).subscribe(a => {
      this.item.auras.push(a)
      this.emitChanges()
    })
  }

  updateUnit(aura: Aura, unit: string) {
    aura.radius.unit = unit
    this.emitChanges()
  }

  updateColor() {
    this.emitChanges()
  }

  toggle(aura : Aura, event : AuraVisible) {
    console.log("AURA CHANGES", event)
    aura.visible = event
    this.updateToggles()
    this.emitChanges()
  }

  delete(aura) {
    const indx = this.item.auras.indexOf(aura)
    if (indx > 0) {
      this.item.auras.splice(indx, 1)
      this.emitChanges()
    }
  }

  edit(aura) {
    AuraEditComponent.openDialog(this.modal, aura).subscribe(a => { this.emitChanges() })
  }

  toggleAll() {
    const value = this.allvisible ? 0 : 1
    this.item.auras.forEach(a => a.visible = value)
    this.allvisible = value;
    this.emitChanges()
  }

  updateToggles() {
    let vis = true
    this.item.auras.forEach(a => vis = vis && a.visible == 1)
    this.allvisible = vis ? 1 : 0
  }

  emitChanges() {
    this.changes.emit()
  }
}
