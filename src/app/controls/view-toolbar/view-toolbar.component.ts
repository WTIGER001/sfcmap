import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-view-toolbar',
  templateUrl: './view-toolbar.component.html',
  styleUrls: ['./view-toolbar.component.css']
})
export class ViewToolbarComponent implements OnInit {
  @Input() item

  constructor() { }

  ngOnInit() {
  }

}
