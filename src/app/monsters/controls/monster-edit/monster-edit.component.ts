import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { ImageSearchResult } from '../../../util/GoogleImageSearch';
import { isArray } from 'util';
import { ImageUtil, LoadImageOptions } from '../../../util/ImageUtil';
import { forkJoin } from 'rxjs';
import { DataService } from '../../../data.service';
import { mergeMap, first } from 'rxjs/operators';
import { Game, Asset } from '../../../models';
import { DbConfig } from '../../../models/database-config';
import { ActivatedRoute } from '@angular/router';
import { Monster } from '../../monster';

@Component({
  selector: 'app-monster-edit',
  templateUrl: './monster-edit.component.html',
  styleUrls: ['./monster-edit.component.css']
})
export class MonsterEditComponent implements AfterContentInit {
  id: string
  gameid: string
  game: Game
  @Input() selected: Monster

  constructor(private data: DataService, private route: ActivatedRoute) {
  }

  ngAfterContentInit() {
    this.data.game.subscribe(g => this.game = g)
    this.route.data.subscribe((data: { asset: Asset }) => this.selected = <Monster>data.asset)



  }

  save() {
    this.data.save(this.selected)
  }

  getSearchTerm() {
    if (this.selected) {
      return this.selected.name + " fantasy art"
    } else {
      return ''
    }
  }

  updatePicture($event: File[] | File | string | ImageSearchResult) {
    if (ImageSearchResult.is($event)) {
      this.selected.image = $event.url
      this.selected.thumb = $event.thumb
    } else if (typeof ($event) == 'string') {
      this.selected.image = $event
      this.selected.thumb = $event
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

    let path = 'monsters/' + this.selected.id
    const opts: LoadImageOptions = {
      createThumbnail: true,
      thumbnailKeepAspect: true,
      thumbnailMaxHeight: 250,
      thumbnailMaxWidth: 175
    }

    ImageUtil.loadImg(f[0], opts).subscribe(r => {
      let pathImage = 'monsters/' + this.selected.id
      let pathThumb = 'monsters/' + this.selected.id + "_thumb"

      const img1$ = this.data.saveImage(r.image, pathImage)
      const img2$ = this.data.saveImage(r.thumb, pathThumb)

      let ir = new ImageSearchResult()
      forkJoin(this.data.saveImage(r.image, pathImage), this.data.saveImage(r.thumb, pathThumb)).pipe(
        mergeMap(result => this.data.setUrl(pathImage, ir)),
        mergeMap(result => this.data.setUrl(pathThumb, ir, true)),
      ).subscribe(r => {
        this.selected.image = r.url
        this.selected.thumb = r.thumb
      }, err => {
        console.debug("ERROR ", err);
      }, () => {
      })

    })


  }

}
