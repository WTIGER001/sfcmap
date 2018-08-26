import { Component, OnInit, Input } from '@angular/core';
import { ObjectType, Game, AssetLink } from '../../models';
import { Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from '../dialog.service';
import { DbConfig } from '../../models/database-config';
import { DataService } from '../../data.service';
import { tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {
  game: Game
  item: AssetLink
  type: string;
  links: AssetLink[] = []
  result = new Subject<boolean>()
  mode = "list"
  fields = []
  choices = []
  gamesystems
  games
  loading = false

  constructor(private modal: NgbActiveModal, private data: DataService) {

  }

  ngOnInit() {
    if (this.game.assetLinks) {
      const typeLinks = this.game.assetLinks[DbConfig.safeTypeName(this.type)]
      if (typeLinks) {
        this.links = typeLinks.map(link => link)
      }
    }

    this.data.games.subscribe(games => this.games = games)
    this.data.gamesystems.subscribe(gs => this.gamesystems = gs)
    this.fields = DbConfig.queryFields(this.type)
  }

  getChoices() {

    if (this.type && this.item && this.item.field && this.item.owner) {
      this.loading = true
      let path = ''
      path = DbConfig.pathFolderTo(this.type, this.item.owner)
      this.data.choices(path, this.item.field)
        .pipe(
          tap(items => this.choices = items),
          tap(items => this.loading = false)
        ).subscribe()
    } else {
      console.log("NOT ENOUGH");
    }
  }

  isChecked(value) {
    return this.item.values.includes(value)
  }

  toggle(value: any) {
    const arr = this.item.values
    if (arr.includes(value)) {
      arr.splice(arr.indexOf(value), 1)
    } else {
      arr.push(value)
    }
  }

  toggleAll() {
    if (this.item.values.length < this.choices.length) {
      this.item.values = this.choices.slice(0)
    } else {
      this.item.values = []
    }
  }

  name(item): string {
    return item;
  }

  values(values: string[]): string {
    return values.join(", ");
  }

  ok() {
    if (this.mode == 'list') {
      this.save()
    } else if (this.mode == 'edit') {
      const indx = this.links.indexOf(this.item)
      if (indx == -1) {
        this.links.push(this.item)
      }
      this.mode = 'list'
    }
  }

  save() {

    if (!this.game.assetLinks) {
      this.game.assetLinks = {}
    }

    this.game.assetLinks[DbConfig.safeTypeName(this.type)] =  this.links
    this.result.next(true)
    this.result.complete()
    this.modal.dismiss()
  }

  cancel() {
    if (this.mode == 'list') {
      this.result.next(false)
      this.result.complete()
      this.modal.dismiss()
    } else if (this.mode == 'edit') {
      this.mode = 'list'
    }
  }

  unlink(item: AssetLink) {
    const indx = this.links.indexOf(item)
    this.links.splice(indx, 1)
  }

  edit(item: AssetLink) {
    this.item = item
    this.mode = 'edit'
  }

  newLink() {
    this.item = new AssetLink()
    this.mode = 'edit'
  }
}
