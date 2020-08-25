import { Component, OnInit } from '@angular/core';
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  loginGoogle() {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  loginGithub() {
    this.afAuth.signInWithPopup(new auth.GithubAuthProvider());
  }
}
