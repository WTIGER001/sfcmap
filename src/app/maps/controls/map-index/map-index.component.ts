import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../../data.service';
import { ActivatedRoute } from '@angular/router';
import { Game, MapConfig, MapType, Asset } from '../../../models';
import { distinctUntilChanged } from 'rxjs/operators';
import { SortFilterField } from '../../../util/sort-filter';

@Component({
  selector: 'app-map-index',
  templateUrl: './map-index.component.html',
  styleUrls: ['./map-index.component.css']
})
export class MapIndexComponent implements OnInit {
  @ViewChild('list') listElement: ElementRef

  gameid: string = 'unk'
  game: Game
  all: MapConfig[] = []
  filtered: MapConfig[] = []
  view = 'card'
  types: MapType[] = []


  lookupType = (id: string): string => {
    const type = this.types.find(a => a.id == id)
    if (type) {
      return type.name
    }
    return "No Folder"
  }

  compareTypes = (a: string, b: String) => {
    const typea = this.types.find(i => i.name == a)
    const typeb = this.types.find(i => i.name == b)
    if (typea && typeb) {
      return typea.order - typeb.order
    } else if (typea) {
      return 1
    } else if (typeb) {
      return -1
    }
    return 0;
  }

  fields: SortFilterField[] = [
    { name: "Name", sort: true, filter: true, text: true, valueFn: (item) => item.name, indexFn: (item) => item.name.substr(0, 1).toUpperCase() },
    { name: "Folder", sort: true, filter: true, text: true, valueFn: (item) => this.lookupType(item.mapType), indexFn: (item) => this.lookupType(item.mapType), compareFn: this.compareTypes }
  ]

  constructor(private data: DataService, private route: ActivatedRoute) {
    this.lookupType.bind(this)
    this.compareTypes.bind(this)
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let id = params.get('gameid')
      this.gameid = id;
      if (id) {
        this.data.games.subscribe(all => {
          let item = all.find(c => c.id == id)
          if (item) {
            this.game = item
            this.data.game.next(item)
          }
        })
      }
    })

    this.data.gameAssets.maps.items$.subscribe(m => {
      // this.data.maps.subscribe(m => {
      this.all = m
      this.filtered = m
    })
    this.data.gameAssets.mapTypes.items$.subscribe(a => this.types = a)
  }

  updateItems($event: MapConfig[]) {
    this.filtered = $event
  }

  scrollTo($event: Asset) {
    if (this.listElement) {
      this.listElement.nativeElement.querySelector("#MAP_" + $event.id).scrollIntoView()
    }
  }



}
