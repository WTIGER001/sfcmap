import { Component, OnInit, Input } from '@angular/core';
import { Game, Asset } from '../../../models';
import { Item } from '../../item';
import { DataService } from '../../../data.service';
import { ActivatedRoute } from '@angular/router';
import { ImageSearchResult } from '../../../util/GoogleImageSearch';
import { isArray } from 'util';
import { LoadImageOptions, ImageUtil } from '../../../util/ImageUtil';
import { forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent {
  id: string
  gameid: string
  game: Game
  @Input() item: Item

  constructor(private data: DataService, private route: ActivatedRoute) {
  }

  ngAfterContentInit() {
    this.data.game.subscribe(g => this.game = g)
    this.route.data.subscribe((data: { asset: Asset }) => this.item = <Item>data.asset)
  }

  save() {
    this.data.save(this.item)
  }

  getSearchTerm() {
    if (this.item) {
      return this.item.name
    } else {
      return 'Magic Item'
    }
  }

  updatePicture($event: File[] | File | string | ImageSearchResult) {
    if (ImageSearchResult.is($event)) {
      this.item.image = $event.url
      this.item.thumb = $event.thumb
    } else if (typeof ($event) == 'string') {
      this.item.image = $event
      this.item.thumb = $event
    } else {
      this.upload($event)
    }
  }

  upload($event: File[] | File) {
    let f: File[] = []
    if (isArray($event)) {
      f = $event
    } else {
      f.push($event)
    }

    let path = 'monsters/' + this.item.id
    const opts: LoadImageOptions = {
      createThumbnail: true,
      thumbnailKeepAspect: true,
      thumbnailMaxHeight: 250,
      thumbnailMaxWidth: 175
    }

    ImageUtil.loadImg(f[0], opts).subscribe(r => {
      let pathImage = 'images/' + this.item.id
      let pathThumb = 'images/' + this.item.id + "_thumb"

      let ir = new ImageSearchResult()
      forkJoin(this.data.saveImage(r.image, pathImage), this.data.saveImage(r.thumb, pathThumb)).pipe(
        mergeMap(result => this.data.setUrl(pathImage, ir)),
        mergeMap(result => this.data.setUrl(pathThumb, ir, true)),
      ).subscribe(r => {
        this.item.image = r.url
        this.item.thumb = r.thumb
      }, err => {
        console.debug("ERROR ", err);
      }, () => {
      })

    })
  }
}