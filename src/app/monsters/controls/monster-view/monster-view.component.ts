import { AfterContentInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteUtil } from 'src/app/util/route-util';
import { DataService } from '../../../data.service';
import { RestrictService } from '../../../dialogs/restrict.service';
import { Asset, Game } from '../../../models';
import { Monster } from '../../monster';

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

 
  cancel() {
    RouteUtil.goUpOneLevel(this.router)
  }

}
