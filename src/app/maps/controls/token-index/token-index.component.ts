import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchBarComponent } from 'src/app/controls/search-bar/search-bar.component';
import { Token } from '../../token';
import { Game, GameSystem } from 'src/app/models';
import { FocusItemCmd } from 'od-virtualscroll';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { SortFilterField } from 'src/app/util/sort-filter';
import { ReplaySubject, BehaviorSubject, Subject } from 'rxjs';
import { ImageUtil } from 'src/app/util/ImageUtil';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-token-index',
  templateUrl: './token-index.component.html',
  styleUrls: ['./token-index.component.css']
})
export class TokenIndexComponent implements OnInit {

  @ViewChild('search') search: SearchBarComponent
  dragging = false
  type = Token.TYPE
  gameid: string
  gsid: string
  game: Game
  gamesystem: GameSystem;
  view: string = 'card'

  cnt = 0;
  filtered: Token[] = []
  paged: Token[] = []
  all: Token[] = []
  loading = false
  startAt = null

  data$ = new ReplaySubject<Token[]>(1)
  options$ = new BehaviorSubject<any>({ itemWidth: 150, itemHeight: 150, numAdditionalRows: 1 })
  cmd$ = new Subject()

  fields: SortFilterField[] = [
    { name: 'Name', valueFn: (item) => item.name, indexFn: (item) => item.name.substr(0, 1).toUpperCase(), sort: true, text: true },
    { name: 'Type', valueFn: (item) => item.type, indexFn: (item) => item.type, sort: true, text: true, filter: true },
  ]
  constructor(private data: DataService, private route: ActivatedRoute, private router: Router) {
    this.data.game.subscribe( g => this.game = g)
  }

  updateView(newview: string) {
    if (newview == 'list') {
      newview = 'card'
    }

    if (newview == 'card') {
      this.options$.next({ itemWidth: 150, itemHeight: 150, numAdditionalRows: 1 })
    } else if (newview == 'small') {
      this.options$.next({ itemWidth: 75, itemHeight: 75, numAdditionalRows: 3 })
    }
    this.view = newview                      

    this.data$.next([])
    this.data$.next(this.filtered)
  }

  updateItems(newItems: Token[]) {
    console.log("Updating Items ", newItems.length);
    this.filtered = newItems
    this.data$.next([])
    this.data$.next(this.filtered)
  }

  ngOnInit() {
    this.data.gameAssets.tokens.items$.pipe().subscribe(a => {
      this.all = a
      if (this.search) {
        this.search.items = a
        this.search.applyFilters()
      }
    })

    this.data.game.subscribe(g => this.game = g)
  }

  scrollTo($event: Token) {
    console.log("Scrolling to ", $event.id);
    const index = this.filtered.indexOf($event)
    if (index >= 0) {
      this.cmd$.next(new FocusItemCmd(index))
    }
  }
  /* ------------------------------------------------------------------------------------------ */
  /* Droppable files                                                                            */
  /* ------------------------------------------------------------------------------------------ */

  dragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  dragEnter(e) {
    e.stopPropagation();
    e.preventDefault();
    this.dragging = true
  }

  dragLeave(e) {
    e.stopPropagation();
    e.preventDefault();
    this.dragging = false
  }

  drop(e) {
    e.stopPropagation();
    e.preventDefault();
    this.dragging = false


    const files = e.dataTransfer.files;
    if (files.length >= 1) {
      this.loadFiles(files)
    }
    return false;
  }
  loadFiles(files : FileList) {
    for( let i=0; i<files.length; i++) { 
      const f = files.item(i)
      ImageUtil.loadImg(f).subscribe(r => {

        const a = new Token()
        a.owner = this.game.id
        // a.id = UUID.UUID().toString()
        a.id = this.data.db.createPushId()
        let name = r.file.name
        name = name.substr(0, name.lastIndexOf("."))
        name = name.replace(/[_-]/g, " ")
        a.name = name
        this.data.saveToken( a, f)
      })

    }
  }
}
