import { Component, OnInit, NgZone } from '@angular/core';
import { MapService } from '../map.service';
import { MapConfig, Annotation, User } from '../models';
import { DataService } from '../data.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {
  expanded = true
  selected = "mapselect"
  mapCfg: MapConfig
  autoexpand = true
  constructor(private zone: NgZone, private mapSvc: MapService, private data: DataService) {
    this.data.user.subscribe(u => {
      if (u.prefs) {
        console.log("UPDATE PREFS");
        this.autoexpand = u.prefs.expandTabOnSelect
      }
    })
    this.mapSvc.selection.subscribe(sel => {
      if (sel.isEmpty()) {
      } else if (sel.type != 'reattach') {
        if (Annotation.is(sel.first) && this.autoexpand) {
          this.expanded = true
          this.selected = 'marker'
        }
      }
    })

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
  }

  ngOnInit() {
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


