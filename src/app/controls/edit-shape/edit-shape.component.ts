import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../data.service';
import { ShapeAnnotation, MergedMapType, Distance } from '../../models';
import { DistanceUnit } from 'src/app/util/transformation';

@Component({
  selector: 'app-edit-shape',
  templateUrl: './edit-shape.component.html',
  styleUrls: ['./edit-shape.component.css']
})
export class EditShapeComponent implements OnInit {

  item: ShapeAnnotation = new ShapeAnnotation('rectangle')
  merged: MergedMapType[]

  radius : Distance = new Distance(0, 'ft')
  units = DistanceUnit.units

  @Input() set shape(item: ShapeAnnotation) {
    console.log("ITEM", item);
    
    this.item = item
    if (this.item.type == 'circle') {
      console.log("Setting Radius ", item.radius);
      
      let radM = this.item.radius
      this.radius.fromMeters(radM)
      console.log("RADIUS", this.radius)
    }
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

  public updateRadius() {
    if (this.item.type == 'circle') {
      this.item.radius = this.radius.asMeters()
    }
  }

  public fmtRadius() : string {
    console.log("FORMATTING ", this.radius.value);
    return this.radius.value.toLocaleString()
    // return this.radius.value.toFixed(2)
  }
}
