import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MonsterText, MonsterIndex } from '../../../models/monsterdb';
import { DataService } from '../../../data.service';
import { EditMonsterComponent } from '../edit-monster/edit-monster.component';
import { RestrictService } from '../../../dialogs/restrict.service';
import { Game } from '../../../models';
import { DbConfig } from '../../../models/database-config';

@Component({
  selector: 'app-monster',
  templateUrl: './monster.component.html',
  styleUrls: ['./monster.component.css']
})
export class MonsterComponent implements AfterContentInit {
  id: string
  gameid: string
  game: Game
  monster: MonsterText
  index: MonsterIndex
  constructor(private router: Router, private route: ActivatedRoute, private data: DataService, private restrict: RestrictService) { }

  ngAfterContentInit() {
    this.data.game.subscribe(g => this.game = g)

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')
      this.gameid = params.get('gameid')

      if (this.gameid) {
        this.data.setCurrentGame(this.gameid)
      }
    })

    this.data.gameAssets.monsters.items$.subscribe(all => {
      let item = all.find(c => c.id == this.id)
      if (item) {
        const owner = item.owner
        this.index = item

        const path = DbConfig.pathTo(MonsterText.TYPE, owner, this.id)
        this.data.db.object<MonsterText>(path).valueChanges().subscribe(item => {
          const mt = DbConfig.toItem(item)
          this.fixStyles(mt)
          this.insertImage(mt)
          this.monster = mt;
        })
      }
    })

  }


  insertImage(monster: MonsterText) {
    if (monster.image) {
      const img = `<img class="monster-img" src="${monster.image}">`

      let index = monster.fulltext.indexOf('<div class="heading">')
      if (index > 0) {
        const t1 = monster.fulltext.substr(0, index)
        const t2 = monster.fulltext.substr(index)
        monster.fulltext = t1 + img + t2
      }
    }
  }

  fixStyles(mt: MonsterText) {
    const imgExp = /<img([A-Za-z0-9"'_ ]*)\b[^>]*>/g

    let text = mt.fulltext
    text = text.replace(new RegExp("<h1>", 'g'), "<h1 class='monster'>")
    text = text.replace(new RegExp("<h2>", 'g'), "<h2 class='monster'>")
    text = text.replace(new RegExp("<h3>", 'g'), "<h3 class='monster'>")
    text = text.replace(new RegExp("<h4>", 'g'), "<h4 class='monster'>")
    text = text.replace(new RegExp("<h5>", 'g'), "<h5 class='monster'>")
    text = text.replace(new RegExp("<h6>", 'g'), "<h6 class='monster'>")
    text = text.replace(new RegExp("<p>", 'g'), "<p class='monster'>")
    text = text.replace(new RegExp("<div>", 'g'), "<div class='monster'>")
    text = text.replace(imgExp, "")
    mt.fulltext = text
  }

}
