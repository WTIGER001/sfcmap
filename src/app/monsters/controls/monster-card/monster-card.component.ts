import { Component, OnInit, Input } from '@angular/core';
import { MonsterText } from '../../../models/monsterdb';
import { DataService } from '../../../data.service';
import { Game } from '../../../models';

@Component({
  selector: 'app-monster-card',
  templateUrl: './monster-card.component.html',
  styleUrls: ['./monster-card.component.css']
})
export class MonsterCardComponent implements OnInit {
  @Input() size : 'card' | 'small' = 'card'
  @Input() item : MonsterText
  @Input() game : Game

  constructor(private data : DataService) { }

  ngOnInit() {
  }


  isLinked(item: MonsterText) {
    return this.data.isLinked(item, this.game.id)
  }

}
