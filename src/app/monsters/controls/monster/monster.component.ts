import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MonsterText } from '../../../models/monsterdb';
import { DataService } from '../../../data.service';

@Component({
  selector: 'app-monster',
  templateUrl: './monster.component.html',
  styleUrls: ['./monster.component.css']
})
export class MonsterComponent implements OnInit {
  monster: MonsterText
  constructor(private router: Router, private route: ActivatedRoute, private data: DataService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id')
      let edit = params.get('edit')

      if (id) {
        this.data.getMonsterText(id).subscribe(mt => {
          this.insertImage(mt)
          this.fixStyles(mt)
          this.monster = mt;
          console.log("TEXT", mt.fulltext);
          console.log("ALL", mt);

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
    let text = mt.fulltext
    text = text.replace(new RegExp("<h1>", 'g'), "<h1 class='monster'>")
    text = text.replace(new RegExp("<h2>", 'g'), "<h2 class='monster'>")
    text = text.replace(new RegExp("<h3>", 'g'), "<h3 class='monster'>")
    text = text.replace(new RegExp("<h4>", 'g'), "<h4 class='monster'>")
    text = text.replace(new RegExp("<h5>", 'g'), "<h5 class='monster'>")
    text = text.replace(new RegExp("<h6>", 'g'), "<h6 class='monster'>")
    text = text.replace(new RegExp("<p>", 'g'), "<p class='monster'>")
    text = text.replace(new RegExp("<div>", 'g'), "<div class='monster'>")
    mt.fulltext = text
  }

}
