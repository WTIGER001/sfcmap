import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../data.service';
import { RestrictService } from '../../../dialogs/restrict.service';
import { Game, Asset } from '../../../models';
import { DbConfig } from '../../../models/database-config';
import { Monster } from '../../monster';
import { MonsterImportCsv } from '../../monster-import-csv';

@Component({
  selector: 'app-monster-view',
  templateUrl: './monster-view.component.html',
  styleUrls: ['./monster-view.component.css']
})
export class MonsterViewComponent implements AfterContentInit {
  id: string
  gameid: string
  game: Game
  item: Monster
  constructor(private router: Router, private route: ActivatedRoute, private data: DataService, private restrict: RestrictService) {


   }

  ngAfterContentInit() {
    this.data.game.subscribe(g => this.game = g)
    this.route.data.subscribe((data: { asset: Asset }) => this.item = <Monster>data.asset)
  }


  // insertImage(monster: MonsterText) {
  //   if (monster.image) {
  //     const img = `<img class="monster-img" src="${monster.image}">`

  //     let index = monster.fulltext.indexOf('<div class="heading">')
  //     if (index > 0) {
  //       const t1 = monster.fulltext.substr(0, index)
  //       const t2 = monster.fulltext.substr(index)
  //       monster.fulltext = t1 + img + t2
  //     }
  //   }
  // }

  // fixStyles(mt: MonsterText) {
  //   const imgExp = /<img([A-Za-z0-9"'_ ]*)\b[^>]*>/g

  //   let text = mt.fulltext
  //   text = text.replace(new RegExp("<h1>", 'g'), "<h1 class='monster'>")
  //   text = text.replace(new RegExp("<h2>", 'g'), "<h2 class='monster'>")
  //   text = text.replace(new RegExp("<h3>", 'g'), "<h3 class='monster'>")
  //   text = text.replace(new RegExp("<h4>", 'g'), "<h4 class='monster'>")
  //   text = text.replace(new RegExp("<h5>", 'g'), "<h5 class='monster'>")
  //   text = text.replace(new RegExp("<h6>", 'g'), "<h6 class='monster'>")
  //   text = text.replace(new RegExp("<p>", 'g'), "<p class='monster'>")
  //   text = text.replace(new RegExp("<div>", 'g'), "<div class='monster'>")
  //   text = text.replace(imgExp, "")
  //   mt.fulltext = text
  // }

  sentences(text: string) : string[] {
    return text.split(".").map( item => item +".")
  }

  specialAbilities(text: string): KeyValue[] {
    let items = text.split(".").map(item => item + ".")
    return items.map( item => {
      const indx = item.indexOf(")")
      if (indx > 0 ) {
        return new KeyValue(item.substring(0, indx), item.substr(indx))
      } else {
        return new KeyValue("UNK", item )
      }
    })
  }

  viewAny(...fields : string[]) {
    let yes = true
    // fields.forEach(f => {
    //   yes = yes && this.data.canViewField(this.monster, f)
    // })
    return yes
  }


}

export class KeyValue {
  constructor(public key : string, public value : string){}
}
export class KeyValueNum {
  constructor(public key: string, public value: string, public num : number) { }
}