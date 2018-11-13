import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-expander',
  templateUrl: './expander.component.html',
  styleUrls: ['./expander.component.css']
})
export class ExpanderComponent implements OnInit {
  @Input() expanded = false
  @Input() text = "Title"

  constructor() { }

  ngOnInit() {
  }

}
