import { Component, OnInit, Input } from '@angular/core';
import { MapConfig } from '../../../models';

@Component({
  selector: 'app-map-card',
  templateUrl: './map-card.component.html',
  styleUrls: ['./map-card.component.css']
})
export class MapCardComponent implements OnInit {
  @Input() gameid: string
  @Input() map: MapConfig
  @Input() size: 'card' | 'small' | 'line' = 'card'

  constructor() { }

  ngOnInit() {
  }

}
