import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../data.service';
import { RestrictService } from '../../../dialogs/restrict.service';
import { Game, Asset } from '../../../models';
import { DbConfig } from '../../../models/database-config';
import { Monster } from '../../monster';
import { MonsterImportCsv } from '../../monster-import-csv';
import { RouteUtil } from 'src/app/util/route-util';

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

  cancel() {
    RouteUtil.goUpOneLevel(this.router)
  }

}

export class KeyValue {
  constructor(public key : string, public value : string){}
}
export class KeyValueNum {
  constructor(public key: string, public value: string, public num : number) { }
}