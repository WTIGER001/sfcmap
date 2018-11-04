import { Component, OnInit, Input } from '@angular/core';
import { Emitter } from '../../detection-manager';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-emitter-edit',
  templateUrl: './emitter-edit.component.html',
  styleUrls: ['./emitter-edit.component.css']
})
export class EmitterEditComponent implements OnInit {
  @Input() item : Emitter
  emissionTypes : string[] = []
  constructor(private data : DataService) {
    this.emissionTypes =  this.data.pathfinder.emissionTypes
   }

  ngOnInit() {

  }

  ok() {

  }

  cancel() {
    
  }

}
