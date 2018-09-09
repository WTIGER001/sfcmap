import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../../data.service';
import { Game } from '../../../models';
import { Monster } from '../../monster';

@Component({
  selector: 'app-monster-card',
  templateUrl: './monster-card.component.html',
  styleUrls: ['./monster-card.component.css']
})
export class MonsterCardComponent implements OnInit {
  @Input() size : 'card' | 'small' = 'card'
  @Input() item : Monster
  @Input() game : Game

  constructor(private data : DataService) { }

  ngOnInit() {
  }


  isLinked(item: Monster) {
    return this.data.isLinked(item, this.game.id)
  }

}
