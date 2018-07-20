import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialogs/dialog.service';
import { DataService } from '../../data.service';
import { MapService } from '../../map.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  tool: string
  constructor(private data: DataService, private mapSvc: MapService) { }

  ngOnInit() {
  }

  updateMapUrls() {
    this.data.updateAllMapUrls()
  }

  clearNewMarkers() {
    this.mapSvc.newMarkersLayer.clearLayers()
    this.mapSvc.printLayers()
  }
}
