import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../../../models/character';

@Component({
  selector: 'app-view-chr-map-links',
  templateUrl: './view-chr-map-links.component.html',
  styleUrls: ['./view-chr-map-links.component.css']
})
export class ViewChrMapLinksComponent implements OnInit {
  @Input() character: Character
  constructor() { }

  ngOnInit() {
  }

}
