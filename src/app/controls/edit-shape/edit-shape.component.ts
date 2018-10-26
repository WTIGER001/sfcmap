import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../data.service';
import { ShapeAnnotation, MergedMapType } from '../../models';

@Component({
  selector: 'app-edit-shape',
  templateUrl: './edit-shape.component.html',
  styleUrls: ['./edit-shape.component.css']
})
export class EditShapeComponent implements OnInit {

  item: ShapeAnnotation = new ShapeAnnotation('rectangle')
  merged: MergedMapType[]

  @Input() set shape(item: ShapeAnnotation) {
    this.item = item
  }

  constructor(private data: DataService) {
    this.data.mapTypesWithMaps.subscribe(items => {
      this.merged = items
    })
  }

  ngOnInit() {
  }

  public update() {
    this.item.copyOptionsToShape()
  }

  public save() {
    this.data.save(this.item)
  }
}
