import { Component, OnInit, NgZone } from '@angular/core';
import { MarkerService, MyMarker } from '../marker.service';
import { MapService } from '../map.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {
  expanded = false
  selected = ""

  constructor(private zone: NgZone, private mapSvc : MapService) {
    // this.mks.selection.subscribe(m => {
    //   // this.zone.run(() => {
    //   this.expanded = true
    //   this.selected = 'marker'
    //   // });
    // })
    this.mapSvc.selection.subscribe( sel => {
      if (sel.isEmpty()) {
        
      } else {
        if (MyMarker.is(sel.first)) {
          this.expanded = true
          this.selected = 'marker'
        }
      }
    })
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
      setTimeout(() => { this.selected = ""}, 800)
    } else {
      this.selected = tab
      this.expanded = true
    }
  }
}


