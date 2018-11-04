import { Component, OnInit, Input } from '@angular/core';
import { LightSource } from 'src/app/models';

@Component({
  selector: 'app-light-selection',
  templateUrl: './light-selection.component.html',
  styleUrls: ['./light-selection.component.css']
})
export class LightSelectionComponent implements OnInit {
  @Input() item: LightSource = new LightSource()
  levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  constructor() { }

  ngOnInit() {
  }

  update() {
    
  }
}
