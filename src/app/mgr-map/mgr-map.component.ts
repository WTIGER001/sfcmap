import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { DataService } from '../data.service';
import { CommonDialogService } from '../dialogs/common-dialog.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MergedMapType, MapConfig, MapType } from '../models';
import { Observable, ReplaySubject } from 'rxjs';
import { UUID } from 'angular2-uuid';
import { DialogService } from '../dialogs/dialog.service';
import { RestrictService } from '../dialogs/restrict.service';

@Component({
  selector: 'app-mgr-map',
  templateUrl: './mgr-map.component.html',
  styleUrls: ['./mgr-map.component.css']
})
export class MgrMapComponent implements OnInit {
  restricted : boolean = false
  merged: MergedMapType[] = []
  selected
  isCollapsed = new Map<any, boolean>()
  sType: string
  result: ImageResult
  thumbnail = "./assets/missing.png"
  @ViewChild('filecontrol') fileButton
  @ViewChild('mycanvas') canvas

  constructor(private zone: NgZone, private activeModal: NgbActiveModal, private cd: CommonDialogService, private data: DataService, private dialog : RestrictService) {
    this.data.mapTypesWithMaps.subscribe(items => {
      this.merged = items
    })
  }

  getFile() {
    console.log(this.fileButton);
    this.fileButton.nativeElement.click()
  }

  setFile(event) {
    if (this.selected) {
      let f = event.target.files[0]
      this.processFile(f).subscribe(val => {
        this.zone.run(() => {
          this.result = val
          this.selected.height = val.height
          this.selected.width = val.width
        })
      })
    }
  }

  processFile(f: File): Observable<ImageResult> {
    console.log("Processing");
    // let thumbImg = this.myimagethumb
    let bigCanvas = document.createElement('canvas')
    let canvas = this.canvas.nativeElement
    let result = new ImageResult()
    let val = new ReplaySubject<ImageResult>()
    let reader = new FileReader()
    reader.readAsDataURL(f)

    reader.onloadend = function () {
      console.log("Load End");

      var url = reader.result
      var img = new Image()
      img.src = url

      img.onload = function () {
        console.log("On Load");

        bigCanvas.width = img.naturalWidth
        bigCanvas.height = img.naturalHeight
        bigCanvas.getContext('2d').drawImage(img, 0, 0)
        bigCanvas.toBlob(b => result.image = b)

        // set size proportional to image
        let w = 150 * (img.width / img.height);
        canvas.width = 150;
        canvas.height = canvas.width * (img.height / img.width);

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        result.height = img.height
        result.width = img.width
        canvas.toBlob(b => result.thumb = b)

        console.log(result);

        val.next(result)
      }
    }
    return val
  }

  save() {
    if (this.selected) {
      if (this.sType == 'map') {
        console.log("Saving Map");
        if (this.result) {
          this.data.saveMap(this.selected, this.result.image, this.result.thumb)
        } else {
          this.data.saveMap(this.selected)
        }
      } else {
        console.log("Saving Map Type");
        this.selected.name = this.escape(this.selected.name)
        this.data.saveMapType(this.selected)
      }
    }
  }

  setType(t) {
    console.log("Saving Map");
    this.restricted = false
    this.selected = t
    this.sType = 'type'
  }

  setMap(t) {
    this.selected = t
    this.sType = 'map'
    this.restricted = this.data.isRestricted(this.selected)
    this.data.url(this.selected).subscribe(
      url => {
        console.log("Got URL : " + url);
        this.thumbnail
        this.loadImage(url)
      }
    )
  }

  loadImage(url: string) {
    let canvas = this.canvas.nativeElement
    let img = new Image()
    img.src = url
    img.onload = function () {
      console.log("On Load");

      // set size proportional to image
      let w = 150 * (img.width / img.height);
      canvas.width = 150;
      canvas.height = canvas.width * (img.height / img.width);

      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }

  ngOnInit() {

  }

  newMap() {
    if (this.selected) {
      let type = ''
      if (this.sType == 'map') {
        type = this.selected.mapType
      } else {
        type = this.selected.id
      }

      let map = new MapConfig()
      map.mapType = type
      map.id = UUID.UUID().toString()

      console.log(map);
      
      this.sType = 'map'
      this.selected = map

      if (this.canvas) {
        let canvas = this.canvas.nativeElement
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }

  newMapType() {
    let mt = new MapType()
    mt.id = UUID.UUID().toString()
    mt.name = "New Map"
    mt.order = 1000

    this.sType = 'type'
    this.selected = mt
  }

  delete() {
    if (this.sType = 'map') {
      this.data.deleteMap(this.selected)
    } else {
      this.data.deleteMapType(this.selected)
    }
  }

  showAccess() {
    if (this.selected && this.sType == 'map') {
      this.dialog.openRestrict(this.selected.view, this.selected.edit).subscribe( result => {
        this.selected.view = result[0]
        this.selected.edit = result[1]
        console.log(this.selected);
        this.restricted = this.data.isRestricted(this.selected)
      })
    }
  }

  escape(str : string) {
    let newStr = JSON.stringify(str)
    let newStr2 = newStr.substring(1, newStr.length-2)
    return newStr2
  }
}

class ImageResult {
  height: number
  width: number
  thumb: Blob
  image: Blob
}
