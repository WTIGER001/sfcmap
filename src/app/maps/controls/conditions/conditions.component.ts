import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.css']
})
export class ConditionsComponent implements OnInit {
  conditions : any[] = []
  categories: any[] = []
  constructor() { }

  ngOnInit() {
  }

  addItem() {

  }

  close()  {
    
  }
}
