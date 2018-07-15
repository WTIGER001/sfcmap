import { Component, OnInit, NgZone } from '@angular/core';
import { MapService } from '../map.service';
import { MapConfig, Annotation } from '../models';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {
  expanded = true
  selected = "mapselect"
  mapCfg: MapConfig
  constructor(private zone: NgZone, private mapSvc: MapService) {
    this.mapSvc.selection.subscribe(sel => {
      if (sel.isEmpty()) {

      } else {
        if (Annotation.is(sel.first)) {
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
        this.mapCfg = m
        this.expanded = true
        this.selected = 'map'
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
    console.log("Toggle");

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


