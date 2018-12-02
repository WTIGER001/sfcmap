import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Annotation, TokenAnnotation, Character, ShapeAnnotation, MarkerTypeAnnotation, ImageAnnotation, BarrierAnnotation } from 'src/app/models';
import { DataService } from 'src/app/data.service';
import { MapService } from '../../map.service';
import { Monster } from 'src/app/monsters/monster';
import { EditCharacterDialogComponent } from 'src/app/characters/controls/edit-character-dialog/edit-character-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MonsterViewDialogComponent } from 'src/app/monsters/controls/monster-view-dialog/monster-view-dialog.component';
import { Router } from '@angular/router';
import { CharacterActions } from 'src/app/characters/character-actions';
import { CommonDialogService } from 'src/app/dialogs/common-dialog.service';
import { RestrictService } from 'src/app/dialogs/restrict.service';

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
  restricted = false;

  constructor(private data: DataService, private mapSvc: MapService, private modal: NgbModal, private router : Router, private dialog : CommonDialogService, private restrict : RestrictService) {

  }

  ngOnInit() {
    this.restricted = this.data.isRestricted(this.item)
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

  canView(field: string) {
    return this.data.canViewField(this.item, field)
  }

  canEdit(field: string) {
    return this.data.canEditField(this.item, field)
  }

  toggleDead() {
    if (TokenAnnotation.is(this.item)) {
      this.item.dead = !this.item.dead
      this.data.save(this.item)
    }
  }

  permissions() {
    if (this.item) {
      this.restrict.openRestrict(this.item).subscribe((r) => {
        if (r) {
          this.data.save(this.item)
          this.restricted = this.data.isRestricted(this.item)
        }
      })
    }
  }

  delete() {
    this.deletes.emit(this.item)
  }

  pin() {

  }

  openLinkedMap() {

    this.router.navigate(['/game', this.item.owner, 'maps', this.item.mapLink])
  } 

  isCharacter(): boolean {
    return (TokenAnnotation.is(this.item) && this.item.itemType == Character.TYPE)
  }

  isMonster(): boolean {
    return (TokenAnnotation.is(this.item) && this.item.itemType == Monster.TYPE)
  }

  isToken() {
    return TokenAnnotation.is(this.item)
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
    if (TokenAnnotation.is(this.item)) {
      const token : TokenAnnotation = this.item
      const char : Character = this.data.gameAssets.characters.currentItems.find( c => c.id == token.itemId)
      if (char) {
        this.dialog.confirm("Copy all the token values to the Character? This will overwrite the current values in the character.", "Copy to Character").subscribe( doit => {
          if (doit) {
            CharacterActions.copyToCharacter(token, char)
            this.data.save(char)
          }
        })
      }
    }
  }

  copyFrom() {
    if (TokenAnnotation.is(this.item)) {
      const token: TokenAnnotation = this.item
      const char: Character = this.data.gameAssets.characters.currentItems.find(c => c.id == token.itemId)
      if (char) {
        this.dialog.confirm("Copy all the values from the Character to this token? This will overwrite the current values in the token.", "Copy from Character").subscribe(doit => {
          if (doit) {
            CharacterActions.copyFromCharacter(token, char)
            this.data.save(token)
          }
        })
      }
    }
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
    this.mapSvc.saveAnnotation(this.item)
    this.changes.emit()
  }
}
