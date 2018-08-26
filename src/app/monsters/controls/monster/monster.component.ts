import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MonsterText } from '../../../models/monsterdb';
import { DataService } from '../../../data.service';
import { EditMonsterComponent } from '../edit-monster/edit-monster.component';
import { RestrictService } from '../../../dialogs/restrict.service';

@Component({
  selector: 'app-monster',
  templateUrl: './monster.component.html',
  styleUrls: ['./monster.component.css']
})
export class MonsterComponent implements OnInit {
  @ViewChild('edit') editCtrl: EditMonsterComponent
  edit = false
  monster: MonsterText
  restricted = false
  constructor(private router: Router, private route: ActivatedRoute, private data: DataService, private restrict: RestrictService) { }

  startEdit() {
    this.edit = true
  }

  delete() {

  }

  restrictions() {

  }

  isLinked() {
    return this.data.isLinked(this.monster)
  }

  save() {
    this.editCtrl.save()
    this.edit = false
  }

  cancel() {
    this.edit = false
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id')
      let edit = params.get('edit')

      if (id) {
        this.data.getMonsterText(id).subscribe(mt => {
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

  permissions() {
    if (this.monster) {
      this.restrict.openRestrict(this.monster).subscribe(([view, edit]) => {
        if (this.data.canEdit(this.monster)) {
          this.data.save(this.monster)
          this.restricted = this.data.isRestricted(this.monster)
        }
      })
    }
  }
}
