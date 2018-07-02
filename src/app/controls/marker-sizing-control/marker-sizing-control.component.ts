import { Component, OnInit, Input } from '@angular/core';
import { MarkerType } from '../../models';

@Component({
  selector: 'app-marker-sizing-control',
  templateUrl: './marker-sizing-control.component.html',
  styleUrls: ['./marker-sizing-control.component.css']
})
export class MarkerSizingControlComponent implements OnInit {

  @Input() item: MarkerType

  constructor() { }

  ngOnInit() {
  }

}
