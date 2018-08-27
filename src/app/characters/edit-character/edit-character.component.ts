import { Component, OnInit } from '@angular/core';
import { Character } from '../../models/character';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { RestrictService } from '../../dialogs/restrict.service';
import { RouteUtil } from '../../util/route-util';
import { Asset } from '../../models';

@Component({
  selector: 'app-edit-character',
  templateUrl: './edit-character.component.html',
  styleUrls: ['./edit-character.component.css']
})
export class EditCharacterComponent implements OnInit {
  character = new Character()

  constructor(private data: DataService, private route: ActivatedRoute, private cd: CommonDialogService, private router: Router) {
    this.character.name = 'New Character'
    this.character.id = UUID.UUID().toString()
  }

  ngOnInit() {
    this.route.data.subscribe((data: { asset: Asset }) => this.character = <Character>data.asset)
  }

  save() {
    this.data.save(this.character)
    RouteUtil.goUpOneLevel(this.router)
  }

  cancel() {
    RouteUtil.goUpOneLevel(this.router)
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
}
