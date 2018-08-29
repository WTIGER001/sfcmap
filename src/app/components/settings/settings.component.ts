import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { combineLatest } from 'rxjs';
import { DataService } from '../../data.service';
import { User, UserAssumedAccess, Prefs } from '../../models';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  user: User
  access: UserAssumedAccess
  prefs: Prefs

  constructor(public afAuth: AngularFireAuth, private data: DataService) {
    combineLatest(
      this.data.user,
      this.data.userPrefs,
    ).subscribe(([u, p]) => {
      this.user = u;
      this.prefs = p
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
    return this.user && this.user.id != "NOBODY"
  }
  updatePrefs() {
    this.data.save(this.prefs)
  }
  save() {
    this.data.save(this.user)
  }
}