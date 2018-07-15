import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../data.service';
import { ShapeAnnotation } from '../../models';

@Component({
  selector: 'app-edit-shape',
  templateUrl: './edit-shape.component.html',
  styleUrls: ['./edit-shape.component.css']
})
export class EditShapeComponent implements OnInit {

  item: ShapeAnnotation = new ShapeAnnotation('rectangle')

  @Input() set shape(item: ShapeAnnotation) {
    console.log("SETTING SHAPE");

    this.item = item
  }

  constructor(private data: DataService) { }

  ngOnInit() {
  }

  public update() {
    console.log("UPDATING SHAPE");

    this.item.copyOptionsToShape()
  }

  public save() {
    this.data.save(this.item)
  }
}
