import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Annotation, TokenAnnotation, Character, ShapeAnnotation, MarkerTypeAnnotation, ImageAnnotation, BarrierAnnotation } from 'src/app/models';
import { DataService } from 'src/app/data.service';
import { MapService } from '../../map.service';
import { Monster } from 'src/app/monsters/monster';
import { EditCharacterDialogComponent } from 'src/app/characters/controls/edit-character-dialog/edit-character-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MonsterViewDialogComponent } from 'src/app/monsters/controls/monster-view-dialog/monster-view-dialog.component';

@Component({
  selector: 'app-selection-container',
  templateUrl: './selection-container.component.html',
  styleUrls: ['./selection-container.component.css']
})
export class SelectionContainerComponent implements OnInit {
  @Input() item: Annotation
  @Output() changes = new EventEmitter
  @Output() edits = new EventEmitter
  @Output() deletes = new EventEmitter

  constructor(private data: DataService, private mapSvc: MapService, private modal: NgbModal) {

  }

  ngOnInit() {

  }

  deselect() {
    this.mapSvc.removeFromSelection(this.item)
  }

  panTo() {
    this.mapSvc.panTo(this.item.center())
  }

  edit() {
    this.edits.emit(this.item)
  }

  restrict() {

  }

  delete() {
    this.deletes.emit(this.item)
  }

  pin() {

  }

  isCharacter(): boolean {
    return (TokenAnnotation.is(this.item) && this.item.itemType == Character.TYPE)
  }

  isMonster(): boolean {
    return (TokenAnnotation.is(this.item) && this.item.itemType == Monster.TYPE)
  }

  editCharacter() {
    if (TokenAnnotation.is(this.item)) {
      const ta: TokenAnnotation = this.item
      const chr = this.data.gameAssets.characters.currentItems.find( i => i.id == ta.itemId)
      if (chr) {
        EditCharacterDialogComponent.open(this.modal, chr)
      } else {
        //FIXME: Show Error
      }
    }
  }

  viewMonster() {
    if (TokenAnnotation.is(this.item)) {
      const ta: TokenAnnotation = this.item
      const mon = this.data.pathfinder.monsters$.getValue().find(i => i.id == ta.itemId)
      if (mon) {
        MonsterViewDialogComponent.openViewDialog(this.modal, mon)
      } else {
        //FIXME: Show Error
      }
    }
  }

  copyTo() {

  }

  copyFrom() {

  }
  
  public itemType(item: Annotation): string {
    if (ShapeAnnotation.is(item)) {
      return 'shape'
    }
    if (MarkerTypeAnnotation.is(item)) {
      return 'marker'
    }
    if (ImageAnnotation.is(item)) {
      return 'image'
    }
    if (TokenAnnotation.is(item)) {
      return 'token'
    }
    if (BarrierAnnotation.is(item)) {
      return 'barrier'
    }
    throw new Error("Invalid Item")
  }

  getAttrs() {
    if (this.item && TokenAnnotation.is(this.item)) {
      return this.item.calcCharacter ? this.item.calcCharacter.attributes || [] : []
    }
  }

  save() {
    this.changes.emit()
  }
}
