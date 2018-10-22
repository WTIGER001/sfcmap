import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../data.service';
import { RestrictService } from '../../../dialogs/restrict.service';
import { Game, Asset } from '../../../models';
import { DbConfig } from '../../../models/database-config';
import { Monster } from '../../monster';
import { MonsterImportCsv } from '../../monster-import-csv';
import { RouteUtil } from 'src/app/util/route-util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
