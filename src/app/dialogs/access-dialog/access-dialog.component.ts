import { Component, OnInit, Input } from '@angular/core';
import { UserGroup, User } from '../../models';
import { DataService } from '../../data.service';
import { ReplaySubject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { INHERITED_CLASS_WITH_CTOR } from '@angular/core/src/reflection/reflection_capabilities';

@Component({
  selector: 'app-access-dialog',
  templateUrl: './access-dialog.component.html',
  styleUrls: ['./access-dialog.component.css']
})
export class AccessDialogComponent implements OnInit {
  @Input() inEdit: string[]
  @Input() inView: string[]

  edit : string[] = []
  view : string[] = []
  viewRestrict
  editRestrict
  users : User[] = []
  groups :UserGroup[] =[]

  result = new ReplaySubject<[string[], string[]]>()

  constructor(private data : DataService, public activeModal: NgbActiveModal) {
    this.data.users.subscribe( u => this.users = u)
    this.data.groups.subscribe( g => this.groups = g)
   }

  ngOnInit() {
    if (this.inEdit) {
      this.edit = this.inEdit.slice(0)
    }
    if (this.inView) {
      this.view = this.inView.slice(0)
    }
    this.update()
  }

  update() {
    if (this.view && this.view.length > 0) {
      this.viewRestrict = 'true'
    } else {
      this.viewRestrict = 'false'
    }

    if (this.edit && this.edit.length > 0) {
      this.editRestrict = 'true'
    } else {
      this.editRestrict = 'false'
    }
  }

  ok() {
    let myView : string[] = []
    if (this.viewRestrict == 'true') {
      myView = this.view
    }
    let myEdit : string[] = []
    if (this.editRestrict == 'true') {
      myEdit = this.edit
    }

    this.result.next([myView, myEdit])
    this.activeModal.close()
  }

  cancel() {
    this.activeModal.close()
  }
}
