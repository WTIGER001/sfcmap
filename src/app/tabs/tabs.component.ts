import { Component, OnInit, NgZone } from '@angular/core';
import { MapService } from '../maps/map.service';
import { MapConfig, Annotation, User, Game } from '../models';
import { DataService } from '../data.service';
import { MessageService } from '../message.service';

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

  constructor(private zone: NgZone, private mapSvc: MapService, private data: DataService, private msg: MessageService) {
    this.data.game.subscribe(a => this.game = a)

    this.msg.rollRequests.subscribe(ex => {
      this.selected = 'rpg'
      this.expanded = true
    })
  }

  ngOnInit() {
    this.mapSvc.mapConfig.subscribe(m => {
      if (m.id == 'BAD') {
        this.mapCfg = undefined
        this.selected = 'mapselect'
      } else {
        if (!this.mapCfg || this.mapCfg.id != m.id) {
          this.expanded = true
          this.selected = 'map'
        }
        this.mapCfg = m
      }
    });

    this.mapSvc.selection.subscribe(sel => {
      if (!sel.isEmpty()) {
        this.selected = 'marker'
      }
    })
  }

  public close() {
    this.selected = ""
    this.expanded = false
  }

  public toggle(tab) {
    if (this.selected === tab) {
      this.expanded = false
      // this.selected = ""
      setTimeout(() => { this.selected = "" }, 800)
    } else {
      this.selected = tab
      this.expanded = true
    }
  }

}


