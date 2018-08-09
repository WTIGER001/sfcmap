import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../dialogs/dialog.service';
import { DataService } from '../../data.service';
import { MapService } from '../../map.service';
import { parse } from 'papaparse'

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
    console.log("IMPORTING")

    // {
    //   delimiter: "",	// auto-detect
    //   newline: "",	// auto-detect
    //   quoteChar: '"',
    //   escapeChar: '"',
    //   header: false,
    //   trimHeaders: false,
    //   dynamicTyping: false,
    //   preview: 0,
    //   encoding: "",
    //   worker: false,
    //   comments: false,
    //   step: undefined,
    //   complete: undefined,
    //   error: undefined,
    //   download: false,
    //   skipEmptyLines: false,
    //   chunk: undefined,
    //   fastMode: undefined,
    //   beforeFirstChunk: undefined,
    //   withCredentials: undefined,
    //   transform: undefined
    // }


    parse(this.csvFile, {
      header: true,
      complete: function (results) {
        console.log(results.data, length);

        let sample = {}
        results.data.forEach(d => Object.assign(sample, d))

        console.log(sample)
        console.log(JSON.stringify(sample, undefined, 4))
      }
    });
  }
}
