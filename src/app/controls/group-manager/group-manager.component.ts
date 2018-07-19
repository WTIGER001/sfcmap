import { Component, OnInit } from '@angular/core';
import { UserGroup, User } from '../../models';
import { DataService } from '../../data.service';
import { CommonDialogService } from '../../dialogs/common-dialog.service';
import { RestrictService } from '../../dialogs/restrict.service';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.css']
})
export class GroupManagerComponent implements OnInit {
  groups: UserGroup[] = []
  users: User[] = []
  user: User;
  selected: UserGroup
  edit: boolean = false
  restricted = false

  constructor(private data: DataService, private cd: CommonDialogService, private restrict: RestrictService) {
    this.data.groups.subscribe(grps => {
      this.groups = grps
    })
    this.data.users.subscribe(usrs => {
      this.users = usrs
    })
    this.data.user.subscribe(user => {
      this.user = user
    })
  }

  ngOnInit() {
  }

  canEdit() {
    return this.data.canEdit(this.selected)
  }

  isRestricted(item: UserGroup) {
    return this.data.isRestricted(item)
  }

  editStart() {
    if (this.selected && this.data.canEdit(this.selected)) {
      this.edit = true
    }
  }

  setGrp(g) {
    this.selected = g
    this.restricted = this.data.isRestricted(g)
  }

  newGroup() {
    let g = new UserGroup()
    g.name = "New Group"
    g.id = 'TEMP'
    g.members = []
    g.members.push(this.user.uid)
    this.selected = g
    this.edit = true
    this.restricted = false
  }

  save() {
    if (this.selected.id == 'TEMP') {
      this.selected.id = UUID.UUID().toString()
      this.selected.edit = [this.selected.id]
    }
    this.data.save(this.selected)
    this.edit = false
    this.selected = undefined
  }

  cancel() {
    this.edit = false
    this.selected = undefined
  }

  permissions() {
    if (this.selected) {
      this.restrict.openRestrict(this.selected.view, this.selected.edit).subscribe(([view, edit]) => {
        if (this.data.canEdit(this.selected)) {
          this.selected.edit = edit
          this.selected.view = view
          this.data.save(this.selected)
          this.restricted = this.data.isRestricted(this.selected)
        }
      })
    }
  }

  delete() {
    if (this.selected) {
      this.cd.confirm("Are you sure you want to delete " + this.selected.name + "?", "Confirm Delete").subscribe(r => {
        if (r) {
          if (this.selected.id != 'TEMP') {
            if (this.data.canEdit(this.selected)) {
              this.data.delete(this.selected)
            }
          }
          this.selected = undefined
        }
      })
    }
  }

}