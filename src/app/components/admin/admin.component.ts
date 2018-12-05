import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { CachedItem } from 'src/app/cache/cache';
import { DataService } from '../../data.service';
import { Monster } from '../../monsters/monster';
import { MonsterImportCsv } from '../../monsters/monster-import-csv';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  constructor(private data: DataService) { }
  monsters: Monster[] = []
  recieved = []

  ngOnInit() {
    const path = "assets/pathfinder/monster-index"
    this.recieved = RItem.generate(this.data.received)
  }


  migrate() {
  }


  copyMonsterPictures() {



  }

  getFile() {

  }

  DeletePathfinder() {
  }

  async createCacheItem() {

    const item = new CachedItem()
    item.path = 'cache/games/pathfinder/monsters'
    item.version = 1

    // Storage path
    const storagePath = `${item.path}_v${item.version}.json`
    await this.data.fillInMyUrl(item, storagePath, "url")

    if (item.url) {
      await this.data.save$(item, item.path)
    }    


  }

  impMonsters2(event) {
    if (event.target.files[0]) {
      const imp = new MonsterImportCsv();
      imp.load(event.target.files[0], false, 0, 10000).then(items => {
        items.forEach(item => {
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

  impMonsters() {

  }
  delMonsters() {

  }

  unk() {

  }


}

class RItem {
  name: string;
  count: number;
  sum: number;
  raw: number[];

  static generate(r: {}) : RItem[] {
    const items: RItem[] = []
    const objs = _.toPairs(r)
    return objs.map((i: any) => {
      const ritem = new RItem()
      ritem.name = i[0]
      ritem.count = i[1].length
      ritem.sum = _.sum(i[1])
      ritem.raw = i[1]
      return ritem
    })
  }
}

