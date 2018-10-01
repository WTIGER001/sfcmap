import { Component, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { ActivatedRoute } from '@angular/router';
import { Asset } from 'src/app/models';
import { Token } from '../../token';

@Component({
  selector: 'app-token-view',
  templateUrl: './token-view.component.html',
  styleUrls: ['./token-view.component.css']
})
export class TokenViewComponent implements AfterViewInit {
  item : Token

  constructor(private data: DataService, private route: ActivatedRoute) {
  }

  ngAfterViewInit() {
    this.route.data.subscribe((data: { asset: Asset }) => {
      if (data.asset) {
        this.item = <Token>data.asset
      }
    })
  }
}