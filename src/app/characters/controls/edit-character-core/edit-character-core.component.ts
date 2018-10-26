import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Character, Asset } from 'src/app/models';
import { DataService } from 'src/app/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonDialogService } from 'src/app/dialogs/common-dialog.service';
import { UUID } from 'angular2-uuid';
import { RouteUtil } from 'src/app/util/route-util';

@Component({
  selector: 'app-edit-character-core',
  templateUrl: './edit-character-core.component.html',
  styleUrls: ['./edit-character-core.component.css']
})
export class EditCharacterCoreComponent implements OnInit {
  @Input() character = new Character()
  @Input() mode = 'edit'
  @Output() onDelete = new EventEmitter()
  @Output() onSave = new EventEmitter()
  @Output() onCancel = new EventEmitter()

  constructor(private data: DataService, private cd: CommonDialogService, private router: Router) {
    this.character.name = 'New Character'
    this.character.id = UUID.UUID().toString()
  }

  ngOnInit() {
  }

  save() {
    this.onSave.emit(this.character)
  }

  cancel() {
    this.onCancel.emit(this.character)
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