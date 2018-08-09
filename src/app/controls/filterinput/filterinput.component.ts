import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filterinput',
  templateUrl: './filterinput.component.html',
  styleUrls: ['./filterinput.component.css']
})
export class FilterinputComponent implements OnInit {
  @Output() filterChanged = new EventEmitter()
  filter: string = ''

  constructor() { }

  ngOnInit() {
  }

  filterUpdate($event) {
    this.filterChanged.emit(this.filter)
  }

  clearFilter() {
    this.filter = ''
    this.filterChanged.emit(this.filter)
  }
}
