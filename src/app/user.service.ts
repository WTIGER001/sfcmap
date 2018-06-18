import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase/app';
import { User as FireUser } from 'firebase/app';

import { AngularFirestore, AngularFirestoreDocument, DocumentSnapshotDoesNotExist, DocumentSnapshotExists, Action, DocumentSnapshot } from 'angularfire2/firestore';


import { isAdmin } from '@firebase/util';
import { ReplaySubject, BehaviorSubject, Observable, of, from } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Starts off with a nobody users
  user = new BehaviorSubject<User>(new User())

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private dbOld: AngularFireDatabase) {
    afAuth.authState
      .pipe(
        map(fireUser => User.fromFireUser(fireUser)),
        mergeMap(u => this.getUserInfo(u))
      )
      .subscribe(u => {
        console.log("User Logged in " + u.uid)
        console.log(u);

        this.user.next(u)
      });
  }

  private getUserInfo(u: User): Observable<User> {
    var id = 'users/' + u.uid

    var item = this.db.collection('users').doc(u.uid)
      .snapshotChanges()
      .pipe(
        mergeMap(result => {
          if (result.payload.exists) {
            console.log(result.payload.data());
            var newUser: User = <User>result.payload.data()
            return of(newUser)
          } else {
            var saveMe = (Object.assign({}, u))
            this.db.collection('users').doc(u.uid).set(saveMe)
            return of(u)
          }
        })
      )


    // .snapshotChanges()
    // .pipe(
    //   mergeMap(action => {
    //     if (action.payload.exists) {
    //       return of(action.payload.data())
    //     } else {

    //     }
    //   })
    // )

    // return of(u)
    return item
  }
}

export class User {
  name: string
  email?: string
  uid: string
  photo?: string
  groups?: string[]
  assumedGroups?: string[]
  approvals?: string[]

  isAdmin(): boolean {
    return this.groups.includes("admin")
  }

  constructor() {
    this.name = "no one"
    this.uid = "NOBODY"
  }

  static fromFireUser(fireUser: FireUser) {
    var u = new User()
    if (fireUser !== null) {
      console.log("Logged in user : " + fireUser.uid);

      u.uid = fireUser.uid
      u.name = fireUser.displayName
      u.email = fireUser.email
      u.photo = fireUser.photoURL
    } else {
      console.log("No User loged in");

    }

    return u
  }
}

const NoUser: User = new User()

