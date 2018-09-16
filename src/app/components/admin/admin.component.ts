import { Component, OnInit } from '@angular/core';
import { FirestoreMigration, FirebaseDataabaseMigration } from '../../util/migration';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { MonsterImportCsv } from '../../monsters/monster-import-csv';
import { DataService } from '../../data.service';
import { Monster } from '../../monsters/monster';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  constructor(private oldDb: AngularFireDatabase, private db: AngularFirestore, private data : DataService) { }
  monsters: Monster[] = []
  ngOnInit() {
    const path = "assets/pathfinder/monster-index"
    this.oldDb.list<Monster>(path).valueChanges().subscribe( all => this.monsters = all)
  }
  

  migrate() {
    const m = new FirebaseDataabaseMigration(this.oldDb, "c4668937-0d91-85ac-8281-ec3caf50be98", "pathfinder")
    m.migrateAll()
  }


  copyMonsterPictures() {
  


  }

  getFile() {

  }


  impMonsters(event) {  
    if (event.target.files[0]) {
    const imp = new MonsterImportCsv();
      imp.load(event.target.files[0], false, 0, 10000).then( items => {
      items.forEach( item => {
        const index = this.monsters.find(i => i.id == item.id)
        if (index) {
          item.image = index.image
          item.thumb = index.thumb
        }
        item.owner = "pathfinder"
        // const newPath = "assets/pathfinder/monster/" + item.id

        // this.oldDb.object(newPath).set(item)?
        this.data.save(item)
      })
    })
  }

  }


  delMonsters() {

  }

  unk() {
    
  }


}

