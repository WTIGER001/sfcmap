import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialogs/dialog.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private dialogs: DialogService) { }

  ngOnInit() {
  }

  openMap() {
    this.dialogs.openMaps()
  }
  openGroup() {
    this.dialogs.openGroups()
  }
}
