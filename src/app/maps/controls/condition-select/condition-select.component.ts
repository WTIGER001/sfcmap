import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-condition-select',
  templateUrl: './condition-select.component.html',
  styleUrls: ['./condition-select.component.css']
})
export class ConditionSelectComponent implements OnInit {
  categories : string[] = []
  constructor() { }

  ngOnInit() {
  }

  close() {
    
  }
}
