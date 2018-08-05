import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../../../models/character';

@Component({
  selector: 'app-edit-chr-map-links',
  templateUrl: './edit-chr-map-links.component.html',
  styleUrls: ['./edit-chr-map-links.component.css']
})
export class EditChrMapLinksComponent implements OnInit {
  @Input() character: Character
  constructor() { }

  ngOnInit() {
  }

}
