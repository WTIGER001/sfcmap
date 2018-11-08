import { Component, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset } from 'src/app/models';
import { Token } from '../../token';
import { RouteUtil } from 'src/app/util/route-util';

@Component({
  selector: 'app-token-view',
  templateUrl: './token-view.component.html',
  styleUrls: ['./token-view.component.css']
})
export class TokenViewComponent implements AfterViewInit {
  item: Token

  constructor(private data: DataService, private route: ActivatedRoute, private router: Router) {
  }

  ngAfterViewInit() {
    this.route.data.subscribe((data: { asset: Asset }) => {
      if (data.asset) {
        this.item = <Token>data.asset
      }
    })
  }

  cancel() {
    RouteUtil.goUpOneLevel(this.router)
  }

  delete() {
    //FIXME : Implement Delete

    RouteUtil.goUpOneLevel(this.router)
  }
}