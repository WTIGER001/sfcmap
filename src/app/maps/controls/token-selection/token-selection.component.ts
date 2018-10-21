import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TokenAnnotation, Character } from 'src/app/models';
import { Monster } from 'src/app/monsters/monster';
import { Token } from '../../token';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-token-selection',
  templateUrl: './token-selection.component.html',
  styleUrls: ['./token-selection.component.css']
})
export class TokenSelectionComponent implements OnInit {
  @Input() item 
  @Output() onPan = new EventEmitter

  constructor(private data : DataService) { }

  ngOnInit() {
  }

  private getTokenItem(token: TokenAnnotation) {
    if (!token) {
      return undefined
    }

    if (token.itemType == Character.TYPE) {
      return this.data.gameAssets.characters.currentItems.find(c => c.id == token.itemId)
    }
    if (token.itemType == Monster.TYPE) {
      return this.data.pathfinder.monsters$.getValue().find(c => c.id == token.itemId)
    }
    
    return undefined

  }
  public tokenIsCharacter(item: TokenAnnotation) {
    return item.itemType == Character.TYPE
  }
  public tokenIsMonster(item: TokenAnnotation) {
    return item.itemType == Monster.TYPE
  }
  public tokenIsToken(item: TokenAnnotation) {
    return item.itemType == Token.TYPE
  }
  pan() {
    this.onPan.emit()
  }
}
