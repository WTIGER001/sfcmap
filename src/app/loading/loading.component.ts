import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  maps: any[]
  mapTypes: any[]
  markerCategories: any[]
  markerTypes: any[]
  users: any[]
  groups: any[]

  constructor(private data: DataService) {
    this.data.maps.subscribe(loaded => this.maps = loaded)
    this.data.mapTypes.subscribe(loaded => this.mapTypes = loaded)
    this.data.markerCategories.subscribe(loaded => this.markerCategories = loaded)
    this.data.markerTypes.subscribe(loaded => this.markerTypes = loaded)
    this.data.users.subscribe(loaded => this.users = loaded)
    this.data.groups.subscribe(loaded => this.groups = loaded)
  }

  ngOnInit() {
  }

}
