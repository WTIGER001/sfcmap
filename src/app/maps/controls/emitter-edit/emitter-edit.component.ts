import { Component, OnInit, Input } from '@angular/core';
import { Emitter } from '../../detection-manager';

@Component({
  selector: 'app-emitter-edit',
  templateUrl: './emitter-edit.component.html',
  styleUrls: ['./emitter-edit.component.css']
})
export class EmitterEditComponent implements OnInit {
  @Input() item : Emitter
  constructor() { }

  ngOnInit() {
  }

  ok() {

  }

  cancel() {
    
  }

}
