import { Component,  Input } from '@angular/core';
import { TokenRecord } from '../../model/encounter';
import { Character, Asset, TokenAnnotation } from 'src/app/models';
import { Monster } from 'src/app/monsters/monster';
import { Token } from 'src/app/maps/token';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-encounter-row',
  templateUrl: './encounter-row.component.html',
  styleUrls: ['./encounter-row.component.css']
})
export class EncounterRowComponent {
  item : Asset
  @Input() row : TokenRecord
  @Input() token: TokenAnnotation
  
  constructor(private data: DataService) { }


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

  getPic() {
    return this.token.url ||  './assets/missing.png'
  }

  checkChange(event) {
    this.row._delete = event
  }

  isChecked() {
    return this.row._delete
  }

}
