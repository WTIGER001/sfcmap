import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { CommonDialogService } from '../dialogs/common-dialog.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MergedMapType } from '../models';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-mgr-map',
  templateUrl: './mgr-map.component.html',
  styleUrls: ['./mgr-map.component.css']
})
export class MgrMapComponent implements OnInit {
  merged : MergedMapType[] = []
  selected
  isCollapsed = new Map<any, boolean>()
  sType : string

  constructor(private activeModal : NgbActiveModal, private cd : CommonDialogService, private data : DataService) { 
    this.data.mapTypesWithMaps.subscribe( items => {
      this.merged = items
    })
  }

  setFile(event) {
    if (this.selected) {
      let f = event.target.files[0]
      this.selected["__FILE"] = f
      this.getDimensions(f).subscribe( val => {
        this.selected.iconSize = val
        this.selected.iconAnchor = [Math.round(val[0]/2), val[1]]
      })
      console.log("FILE")
      console.log( this.selected["__FILE"]);
    }
  }

  getDimensions(f : File) : Observable<[number, number]> {
    let val = new ReplaySubject<[number, number]> ()
    let reader = new FileReader()
    reader.readAsDataURL(f)
      reader.onloadend = function() {
        var url = reader.result
        var img = new Image()
        img.src = url
        img.onload=function(){
          val.next([img.width, img.height])
      }
    }
    return val
  }

  setType(t) {
    this.selected = t
    this.sType = 'type'
  }
  setMap(t) {
    this.selected = t
    this.sType = 'map'
  }

  ngOnInit() {
  }

}
