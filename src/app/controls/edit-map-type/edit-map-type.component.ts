import { Component, OnInit, Input } from '@angular/core';
import { MapType } from '../../models';
import { UUID } from 'angular2-uuid';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-edit-map-type',
  templateUrl: './edit-map-type.component.html',
  styleUrls: ['./edit-map-type.component.css']
})
export class EditMapTypeComponent implements OnInit {
  @Input() selected: MapType

  constructor(private data: DataService) { }

  ngOnInit() {
  }

  save() {
    if (this.selected) {
      if (this.selected.id == 'TEMP') {
        this.selected.id = UUID.UUID().toString()
      }
      let m = new MapType()
      m.id = this.selected.id
      m.name = this.selected.name
      m.defaultMarker = this.selected.defaultMarker
      m.order = this.selected.order

      this.data.save(m)
    }
  }
}
