import { Component, OnInit, Input } from '@angular/core';
import { GameSystem } from '../../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../data.service';
import { UUID } from 'angular2-uuid';
import { ImageSearchResult } from '../../../util/GoogleImageSearch';
import { isArray } from 'util';
import { LoadImageOptions, ImageUtil } from '../../../util/ImageUtil';
import { forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { RouteUtil } from '../../../util/route-util';

@Component({
  selector: 'app-gamesystem-edit',
  templateUrl: './gamesystem-edit.component.html',
  styleUrls: ['./gamesystem-edit.component.css']
})
export class GamesystemEditComponent implements OnInit {
  @Input() gs: GameSystem = new GameSystem()

  constructor(private route: ActivatedRoute, private router: Router, private data: DataService) {
    this.gs = new GameSystem()
    this.gs.name = 'New Game System'
    this.gs.id = UUID.UUID().toString()
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let gsid = params.get('gsid')
      if (gsid) {
        this.data.gamesystems.subscribe(all => {
          let found = all.find(item => item.id == gsid)
          if (found) {
            this.gs = found
          }
        })
      }
    })
  }

  save() {
    this.data.save(this.gs)
    RouteUtil.goUpOneLevel(this.router)
  }

  updatePicture($event: File[] | File | string | ImageSearchResult) {
    if (ImageSearchResult.is($event)) {
      this.gs.logo = $event.url
    } else if (typeof ($event) == 'string') {
      this.gs.logo = $event
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

    let path = 'gamesystems/' + this.gs.id
    const opts: LoadImageOptions = {
      createThumbnail: false,
      thumbnailKeepAspect: true,
      thumbnailMaxHeight: 250,
      thumbnailMaxWidth: 175
    }

    ImageUtil.loadImg(f[0], opts).subscribe(r => {
      let pathImage = 'gamesystems/' + this.gs.id

      console.log("IMAGE", r);
      let ir = new ImageSearchResult()
      forkJoin(this.data.saveImage(r.file, pathImage)).pipe(
        mergeMap(result => this.data.setUrl(pathImage, ir)),
      ).subscribe(r => {
        this.gs.logo = r.url
      }, err => {
        console.debug("ERROR ", err);
      }, () => {
      })

    })


  }
}
