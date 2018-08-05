import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../../../models/character';

@Component({
  selector: 'app-view-chr-attributes',
  templateUrl: './view-chr-attributes.component.html',
  styleUrls: ['./view-chr-attributes.component.css']
})
export class ViewChrAttributesComponent implements OnInit {
  @Input() character: Character
  constructor() { }

  ngOnInit() {
  }

}
