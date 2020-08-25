import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { auth } from 'firebase';
import { combineLatest } from 'rxjs';
import { DataService } from '../../data.service';
import { Prefs, User, UserAssumedAccess } from '../../models';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  user: User
  access: UserAssumedAccess
  prefs: Prefs

  constructor(public afAuth: AngularFireAuth, private data: DataService, private activeModal : NgbActiveModal) {
    combineLatest(
      this.data.user,
      this.data.userPrefs,
    ).subscribe(([u, p]) => {
      this.user = u;
      this.prefs = p
    })
  }

  close() {
    this.activeModal.dismiss()
  }

  ngOnInit() {
  }

  loginGoogle() {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  loginGithub() {
    this.afAuth.signInWithPopup(new auth.GithubAuthProvider());
  }
  logout() {
    this.afAuth.signOut();
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

  public static openDialog(modal : NgbModal) {
    modal.open(SettingsComponent)

  }
}