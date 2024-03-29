import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Game, MapConfig, MapType, Asset } from '../../../models';
import { distinctUntilChanged } from 'rxjs/operators';
import { SortFilterField } from '../../../util/sort-filter';
import { SearchBarComponent } from 'src/app/controls/search-bar/search-bar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MarkerTypeManagerComponent } from 'src/app/controls/marker-type-manager/marker-type-manager.component';
import { EditMapTypeComponent } from 'src/app/controls/edit-map-type/edit-map-type.component';

@Component({
  selector: 'app-map-index',
  templateUrl: './map-index.component.html',
  styleUrls: ['./map-index.component.css']
})
export class MapIndexComponent implements OnInit {
  @ViewChild('list', { static: true }) listElement: ElementRef
  @ViewChild('searchbar', { static: true }) searchbar: SearchBarComponent

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

  constructor(private data: DataService, private route: ActivatedRoute, private modal : NgbModal, private router: Router) {
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

    this.searchbar.addTool('right', 'map-marker-alt', 'Markers', () => { MarkerTypeManagerComponent.openDialog(this.modal)})
    this.searchbar.addTool('right', 'folder-plus', 'Folders', () => { EditMapTypeComponent.openDialog(this.modal)})
    this.searchbar.addTool('right', 'helmet-battle', 'Tokens', () => { this.router.navigate(["/game", this.gameid, 'tokens'])})
  }

  openMarkers() {
    MarkerTypeManagerComponent.openDialog(this.modal)
  }

  openMapTypes() {

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
