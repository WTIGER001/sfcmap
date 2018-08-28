import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../data.service';
import { ActivatedRoute } from '@angular/router';
import { Game, Asset } from '../../../models';
import { Item } from '../../item';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit {
  item : Item
  game: Game
  constructor(private data: DataService, private route: ActivatedRoute) {
  }
  ngOnInit() {
    this.data.game.subscribe(g => this.game = g)
    this.route.data.subscribe((data: { asset: Asset }) => this.item = <Item>data.asset)
  }

}
