import { Component, OnInit, NgZone } from '@angular/core';
import { MapService } from '../maps/map.service';
import { MapConfig, Annotation, User, Game, Asset } from '../models';
import { DataService } from '../data.service';
import { MessageService } from '../message.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {
  expanded = false
  selected = ''
  game: Game;
  mapCfg: MapConfig

  constructor(private zone: NgZone, private mapSvc: MapService, private data: DataService, private msg: MessageService, private route: ActivatedRoute, private router: Router) {
    this.data.game.subscribe(a => this.game = a)

    this.msg.rollRequests.subscribe(ex => {
      this.selected = 'rpg'
      this.expanded = true
    })
  }

  ngOnInit() {

    // Since the tabs are not in the router-outlet it does not receive the route data subscription so we have a work around
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(e => {
      this.loadMap()
    })

    this.mapSvc.selection.subscribe(sel => {
      if (!sel.isEmpty()) {
        this.selected = 'marker'
      }
    })
  }

  private loadMap() {
    if (this.router.routerState.snapshot.root.firstChild) {
      const data = this.router.routerState.snapshot.root.firstChild.data
      if (data.asset && MapConfig.is(data.asset)) {
        this.mapCfg = <MapConfig>data.asset
      } else {
        this.mapCfg = undefined
      }
    } else {
      this.mapCfg = undefined
    }
  }

  public close() {
    this.selected = ""
    this.expanded = false
  }

  public toggle(tab) {
    if ( this.expanded == false) {
      this.selected = tab
      this.expanded = true
    } else if (this.selected === tab) {
      this.expanded = false
      // this.selected = ""
      setTimeout(() => { this.selected = "" }, 800)
    } else {
      this.selected = tab
      this.expanded = true
    }
  }

}


