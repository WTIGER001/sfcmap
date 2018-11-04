import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { BarrierAnnotation } from 'src/app/models';

@Component({
  selector: 'app-barrier-edit',
  templateUrl: './barrier-edit.component.html',
  styleUrls: ['./barrier-edit.component.css']
})
export class BarrierEditComponent implements OnInit {
  @Input() item : BarrierAnnotation
  emissionTypes : string[] = []

  constructor(private data : DataService) {
    this.emissionTypes =  this.data.pathfinder.emissionTypes  
  }

  public update() {
    this.item.copyOptionsToShape()
  }

  ngOnInit() {
  }

}
