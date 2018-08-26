import { Component, OnInit } from '@angular/core';
import { AbstractValueAccessor } from '../value-accessor';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-restriction-toggle',
  templateUrl: './restriction-toggle.component.html',
  styleUrls: ['./restriction-toggle.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: RestrictionToggleComponent, multi: true }
  ]
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
