import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialogs/dialog.service';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  tool: string
  constructor(private dialogs: DialogService, private data: DataService) { }

  ngOnInit() {
  }

  openMap() {
    this.dialogs.openMaps()
  }

  updateMapUrls() {
    this.data.updateAllMapUrls()
  }
}
