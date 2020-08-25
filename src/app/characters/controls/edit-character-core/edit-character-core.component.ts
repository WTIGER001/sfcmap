import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Character, Asset, DiceRoll } from 'src/app/models';
import { DataService } from 'src/app/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonDialogService } from 'src/app/dialogs/common-dialog.service';
import { UUID } from 'angular2-uuid';
import { RouteUtil } from 'src/app/util/route-util';
import { DiceResultComponent } from 'src/app/controls/dice-result/dice-result.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DiceCanvasComponent } from 'src/app/controls/dice-canvas/dice-canvas.component';

@Component({
  selector: 'app-edit-character-core',
  templateUrl: './edit-character-core.component.html',
  styleUrls: ['./edit-character-core.component.css']
})
export class EditCharacterCoreComponent implements OnInit {
  @ViewChild('dice', { static: true }) dice: DiceCanvasComponent

  @Input() character = new Character()
  @Input() mode = 'edit'
  @Output() onDelete = new EventEmitter()
  @Output() onSave = new EventEmitter()
  @Output() onCancel = new EventEmitter()

  constructor(private data: DataService, private cd: CommonDialogService, private router: Router, private modal : NgbModal) {
    this.character.name = 'New Character'
    this.character.id = UUID.UUID().toString()
  }

  ngOnInit() {
  }

  save() {
    console.log("Saving Character", this.character);
    this.onSave.emit(this.character)
  }

  cancel() {
    this.onCancel.emit(this.character)
  }

  rolled(r : DiceRoll) {
    DiceResultComponent.showDialog(this.modal, r).subscribe( done => {
      this.dice.roller.clear()
    })
  }

  cleared(r : DiceRoll) {

  }

  getSearchTerm() {
    if (this.character.tags) {
      return this.character.tags.join(' ') + " fantasy art"
    } else {
      return "human fighter fantasy art"
    }
  }

  delete() {
    this.cd.confirm("Are you sure you want to delete " + this.character.name + "? ", "Confirm Delete").subscribe(
      r => {
        if (r) {
          this.onDelete.emit(this.character)
        }
      }
    )
  }
}