import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { DataService } from '../../data.service';
import { User, UserGroup, UserAssumedAccess, Prefs } from '../../models';
import { zip, combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { MapService } from '../../map.service';

@Component({
  selector: 'app-user-side',
  templateUrl: './user-side.component.html',
  styleUrls: ['./user-side.component.css']
})
export class UserSideComponent implements OnInit {

  user: User
  access: UserAssumedAccess
  prefs: Prefs
  groups: UserGroup[] = []

  constructor(public afAuth: AngularFireAuth, private mapSvc: MapService, private data: DataService) {
    combineLatest(
      this.data.user,
      this.data.userAccess,
      this.data.userPrefs,
      this.data.groups
    ).subscribe(([u, ua, p, g]) => {
      this.user = u;
      this.access = ua
      this.prefs = p
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
  loginGithub() {
    this.afAuth.auth.signInWithPopup(new auth.GithubAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }
  isValid() {
    return this.user && this.user.uid != "NOBODY"
  }
  updatePrefs() {
    this.data.save(this.prefs)
  }
  save() {
    this.data.save(this.access)
  }
}
