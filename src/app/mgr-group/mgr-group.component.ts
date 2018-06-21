import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { UserGroup } from '../models';
import { User } from '../user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonDialogService } from '../dialogs/common-dialog.service';

@Component({
  selector: 'app-mgr-group',
  templateUrl: './mgr-group.component.html',
  styleUrls: ['./mgr-group.component.css']
})
export class MgrGroupComponent implements OnInit {
  groups : UserGroup[]= [] 
  users : User[] = []
  members: string[] = []
  selected : UserGroup

  constructor(private data : DataService, private activeModal : NgbActiveModal, private cd : CommonDialogService) {
    this.data.groups.subscribe( grps => {
      this.groups = grps
    })
    this.data.users.subscribe( usrs => {
      this.users = usrs
    })
  }

  ngOnInit() {
  }

  setGrp(g) {
    let copy = JSON.parse( JSON.stringify(g))
    this.selected = copy
    console.log(this.selected);

    if (this.selected.members) {
      this.members = this.selected.members
    } else {
      this.members = []
    }
  }

  newGroup() {
    let g = new UserGroup()
    g.name = "New Group"
    
    this.selected = g
  }

  save() {
    this.selected.members = this.members
    console.log(this.selected);
    this.data.saveUserGroup(this.selected)
  }

  delete() {
    if (this.selected) {
      this.cd.confirm("Are you sure you want to delete " + this.selected.name +"?", "Confirm Delete").subscribe( r => {
        if (r) {
          this.data.deleteUserGroup(this.selected)
          this.selected = undefined
        }
      })
    }
  }
}
