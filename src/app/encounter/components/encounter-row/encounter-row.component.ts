import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { TokenRecord } from '../../model/encounter';
import { Character, Asset } from 'src/app/models';
import { Monster } from 'src/app/monsters/monster';
import { Token } from 'src/app/maps/token';
import { DataService } from 'src/app/data.service';
import { LangUtil } from 'src/app/util/LangUtil';

@Component({
  selector: 'app-encounter-row',
  templateUrl: './encounter-row.component.html',
  styleUrls: ['./encounter-row.component.css']
})
export class EncounterRowComponent implements OnInit , AfterContentInit{
  item : Asset
  @Input() row : TokenRecord
  
  constructor(private data: DataService) { }

  ngOnInit() {
    
  }

  getType() {
    if (this.row.type == Character.TYPE) {
      return "Character"
    } else if (this.row.type == Monster.TYPE) {
      return "Monster"
    } else if (this.row.type == Token.TYPE) {
      return "Token"
    } else {
      return "???"
    }
  }
  ngAfterContentInit() {
    this.item = this.getItem()
  }

  getItem() : Asset {
    if (this.row.type == Character.TYPE) {
      return this.data.gameAssets.characters.currentItems.find( i => i.id == this.row.id)
    } else if (this.row.type == Monster.TYPE) {
      return this.data.gameAssets.monsters.currentItems.find(i => i.id == this.row.id)
    } else if (this.row.type == Token.TYPE) {
      return this.data.gameAssets.tokens.currentItems.find(i => i.id == this.row.id)
    } else {
      throw new Error('Invlaid item type ' + this.row.type)
    }
  }

  getPic() {
    const item : any= this.getItem()
    if (item) {
      return LangUtil.firstDefined(item.token, item.thumb, item.image, item.thumb, './assets/missing.png')
    }
    return './assets/missing.png'
  }

  checkChange(event) {
    this.row._delete = event
  }

  isChecked() {
    return this.row._delete
  }

}
