import { Component, OnInit, Output, EventEmitter, NgZone } from '@angular/core';
import { ImageResult, ImageUtil } from 'src/app/util/ImageUtil';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { UUID } from 'angular2-uuid';
import { Token } from '../../token';
import { Game, Asset } from 'src/app/models';
import { ImageSearchResult } from 'src/app/util/GoogleImageSearch';
import { RouteUtil } from 'src/app/util/route-util';

@Component({
  selector: 'app-token-edit',
  templateUrl: './token-edit.component.html',
  styleUrls: ['./token-edit.component.css']
})
export class TokenEditComponent implements OnInit {
  game: Game
  image
  item: Token
  result: ImageResult

  @Output() changes = new EventEmitter<Token>()
  @Output() imageChanges = new EventEmitter<ImageResult>()

  constructor(private zone: NgZone, private data: DataService, private route: ActivatedRoute, private router: Router) {
    this.item = new Token()
    this.item.id = UUID.UUID().toString()

    this.data.game.subscribe(game => this.game = game)
  }

  ngAfterViewInit() {
    this.route.data.subscribe((data: { asset: Asset }) => {
      if (data.asset) {
        this.item = <Token>data.asset
        this.image = this.item.image
      }
    })
  }

  updatePicture($event) {
    console.log("Update Picture ", typeof ($event), $event);
    if (ImageSearchResult.is($event)) {
      this.item.image = $event.url
      this.image = $event.url
    } else if (typeof ($event) == 'string') {
      this.item.image = $event
      this.image = $event
    } else if ($event instanceof File) {
      ImageUtil.loadImg($event, { createThumbnail: false, thumbnailMaxWidth: 300 }).subscribe(val => {
        this.zone.run(() => {
          this.result = val
          this.image = val.dataURL
          console.log("Processed Picture ", this.result);
        })
      })
    }
  }

  ngOnInit() {
  }

  save() {
    console.log("SAVING Token");
    if (this.item && this.game) {
      this.item.owner = this.game.id
      if (this.result) {
        console.log("SAVING Token with IMages");
        this.data.saveToken(this.item, this.result.file)
      } else {
        console.log("SAVING Token Meta");
        this.data.saveToken(this.item)
      }
    }
  }

  cancel() {
    RouteUtil.goUpTwoLevels(this.router)
  }
}