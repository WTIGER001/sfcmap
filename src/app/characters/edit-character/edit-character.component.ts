import { Component, OnInit } from '@angular/core';
import { Character } from '../../models/character';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { RestrictService } from '../../dialogs/restrict.service';
import { RouteUtil } from '../../util/route-util';

@Component({
  selector: 'app-edit-character',
  templateUrl: './edit-character.component.html',
  styleUrls: ['./edit-character.component.css']
})
export class EditCharacterComponent implements OnInit {

  edit = false
  character = new Character()
  restricted = false

  constructor(private data: DataService, private route: ActivatedRoute, private cd: CommonDialogService, private restrict: RestrictService, private router: Router) {
    this.character.name = 'New Character'
    this.character.id = UUID.UUID().toString()

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id')
      let edit = params.get('edit')

      if (id) {
        this.data.characters.subscribe(all => {
          let chr = all.find(c => c.id == id)
          if (chr) {
            this.character = chr
          }
        })
      }
    })
  }

  save() {
    this.data.save(this.character)
    this.edit = true
  }

  cancel() {
    this.edit = false;
    RouteUtil.goUpOneLevel(this.router)
  }

  startEdit() {
    this.edit = true
  }

  getSearchTerm() {
    if (this.character.tags) {
      return this.character.tags.join(' ') + " fatansy art"
    } else {
      return "human fighter fantasy art"
    }
  }

  delete() {
    this.cd.confirm("Are you sure you want to delete " + this.character.name + "? ", "Confirm Delete").subscribe(
      r => {
        if (r) {
          this.data.delete(this.character)
          RouteUtil.goUpTwoLevels(this.router)
        }
      }
    )
  }

  permissions() {
    if (this.character) {
      this.restrict.openRestrict(this.character.view, this.character.edit).subscribe(([view, edit]) => {
        if (this.data.canEdit(this.character)) {
          this.character.edit = edit
          this.character.view = view
          this.data.save(this.character)
          this.restricted = this.data.isRestricted(this.character)
        }
      })
    }
  }
}
