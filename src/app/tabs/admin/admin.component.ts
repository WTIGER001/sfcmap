import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialogs/dialog.service';
import { DataService } from '../../data.service';
import { MapService } from '../../map.service';
import { parse } from 'papaparse'
import { MonsterDB } from '../../models/monsterdb';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  tool: string
  csvFile: File
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

  setCsvFile(event) {
    if (event.target.files) {
      this.csvFile = event.target.files[0]
    }
  }

  importCsv() {

    MonsterDB.loadme(this.csvFile).then(r => {
      this.data.loadMonsters(r.index, r.text, false)
    })

    // console.log("IMPORTING")
    // MonsterDB.parseCsvFile(this.csvFile).subscribe(r => {
    //   // this.data.loadMonsters(r.index, r.text, false)
    //   console.log("Index: ", r.index);
    //   console.log("Text: ", r.text);
    // })
  }
}
