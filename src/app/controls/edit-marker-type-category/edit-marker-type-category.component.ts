import { Component, OnInit, Input } from '@angular/core';
import { MarkerCategory, Category, MapType } from '../../models';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-edit-marker-type-category',
  templateUrl: './edit-marker-type-category.component.html',
  styleUrls: ['./edit-marker-type-category.component.css']
})
export class EditMarkerTypeCategoryComponent implements OnInit {
  @Input() selected: Category
  mapTypes: MapType[] = []

  constructor(private data: DataService) {
    this.data.gameAssets.mapTypes.items$.subscribe(types => this.mapTypes = types)
  }

  ngOnInit() {
  }



}
