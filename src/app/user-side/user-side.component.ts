import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { MarkerService } from '../marker.service';
import { auth } from 'firebase';
import { DataService } from '../data.service';
import { User, UserGroup } from '../models';
import { zip, combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-side',
  templateUrl: './user-side.component.html',
  styleUrls: ['./user-side.component.css']
})
export class UserSideComponent implements OnInit {

  user: User
  groups: UserGroup[] = []

  constructor(public afAuth: AngularFireAuth, private markers: MarkerService, private data: DataService) {
    combineLatest(
      this.data.user,
      this.data.groups
    ).subscribe(([u, g]) => {
      this.user = u;
      let newGroups = []
      g.forEach(grp => {
        if (grp.members.includes(u.uid)) {
          newGroups.push(grp)
        }
      })
      this.groups = newGroups
    })
  }

  ngOnInit() {
  }

  loginGoogle() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }
  isValid() {
    return this.user && this.user.uid != "NOBODY"
  }
  save() {
    this.data.saveUser(this.user)
  }
}
