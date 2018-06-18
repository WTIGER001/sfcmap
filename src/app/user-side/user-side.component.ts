import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { MarkerService } from '../marker.service';
import { UserService, User } from '../user.service';
import { auth } from 'firebase';

@Component({
  selector: 'app-user-side',
  templateUrl: './user-side.component.html',
  styleUrls: ['./user-side.component.css']
})
export class UserSideComponent implements OnInit {

  user: User

  constructor(public afAuth: AngularFireAuth, private markers: MarkerService, private userSvc: UserService) {
    this.userSvc.user.subscribe(u => {
      this.user = u
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
    return this.user.uid != "NOBODY"
  }

}
