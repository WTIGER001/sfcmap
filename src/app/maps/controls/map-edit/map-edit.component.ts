import { Component, OnInit, ViewChild, Output, EventEmitter, NgZone, Input } from '@angular/core';
import { MapConfig, Game, Asset } from '../../../models';
import { ImageResult, ImageUtil } from '../../../util/ImageUtil';
import { UUID } from 'angular2-uuid';
import { DataService } from '../../../data.service';
import { Util } from 'leaflet';
import { ImageSearchResult } from '../../../util/GoogleImageSearch';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteUtil } from 'src/app/util/route-util';

@Component({
  selector: 'app-map-edit',
  templateUrl: './map-edit.component.html',
  styleUrls: ['./map-edit.component.css']
})
export class MapEditComponent implements OnInit {
  game: Game
  image
  item: MapConfig
  result: ImageResult

  @Output() changes = new EventEmitter<MapConfig>()
  @Output() imageChanges = new EventEmitter<ImageResult>()

  constructor(private zone: NgZone, private data: DataService, private route: ActivatedRoute, private router: Router) {
    this.item = new MapConfig()
    this.item.id = UUID.UUID().toString()

    this.data.game.subscribe(game => this.game = game)
  }

  ngAfterViewInit() {
    this.route.data.subscribe((data: { asset: Asset }) => {
      if (data.asset) {
        this.item = <MapConfig>data.asset
        this.image = this.item.image
      }
    })
  }

  updatePicture($event) {
    console.log("Update Picture ", typeof ($event), $event);
    if (ImageSearchResult.is($event)) {
      this.item.image = $event.url
      this.item.thumb = $event.thumb
      this.image = $event.url
    } else if (typeof ($event) == 'string') {
      this.item.image = $event
      this.item.thumb = $event
      this.image = $event
    } else if ($event instanceof File) {
      ImageUtil.loadImg($event, { createThumbnail: true, thumbnailMaxWidth: 300 }).subscribe(val => {
        this.zone.run(() => {
          this.result = val
          this.item.height = val.height
          this.item.width = val.width
          this.image = val.dataURL
          console.log("Processed Picture ", this.result);
        })
      })
    }
  }

  ngOnInit() {
  }

  save() {
    console.log("SAVING MAP");
    if (this.item && this.game) {
      this.item.owner = this.game.id
      if (this.result) {
        console.log("SAVING MAP with IMages");
        this.data.saveMap(this.item, this.result.file, this.result.thumb)
      } else {
        console.log("SAVING MAP Meta");
        this.data.saveMap(this.item)
      }
    }
  }

  cancel() {
    if (this.router.url.indexOf("new-map") > 0) {
      this.router.navigate(["../maps"], { relativeTo: this.route });
    } else {
      RouteUtil.goUpOneLevel(this.router)
    }
  }
}
