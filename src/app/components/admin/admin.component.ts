import { Component, OnInit } from '@angular/core';
import { FirestoreMigration, FirebaseDataabaseMigration } from '../../util/migration';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private oldDb: AngularFireDatabase, private db: AngularFirestore) { }

  ngOnInit() {
  }

  migrate() {
    // const m = new FirestoreMigration(this.oldDb, this.db, "c4668937-0d91-85ac-8281-ec3caf50be98", "pathfinder")
    const m = new FirebaseDataabaseMigration(this.oldDb, "c4668937-0d91-85ac-8281-ec3caf50be98", "pathfinder")
    // m.migrateGames()
    // m.migrateMonsters()
    // m.migrateMaps()
    // m.migratePerMap()
    // m.migrateUsers()
    // m.migrateUserPrefs()
    // m.migrateUserPrefs()
    // m.migrateAnnotations
    // m.migrateAll()
    // m.fixFields()
  }


  copyMonsters() {

  }
}
