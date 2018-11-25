import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-expander',
  templateUrl: './expander.component.html',
  styleUrls: ['./expander.component.css']
})
export class ExpanderComponent implements OnInit {
  @Input() expanded = false
  @Input() text = "Title"
  @Output() clk = new EventEmitter() 

  constructor() { }

  ngOnInit() {
  }

  headerClick() {
    this.expanded = !this.expanded
    this.clk.emit()
  }

}
