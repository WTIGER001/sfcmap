import { Component, OnInit } from '@angular/core';
import { AbstractValueAccessor } from '../value-accessor';

@Component({
  selector: 'app-restriction-toggle',
  templateUrl: './restriction-toggle.component.html',
  styleUrls: ['./restriction-toggle.component.css']
})
export class RestrictionToggleComponent extends AbstractValueAccessor implements OnInit {


  constructor() {
    super()
  }

  ngOnInit() {

  }

  refresh() {

  }
}
