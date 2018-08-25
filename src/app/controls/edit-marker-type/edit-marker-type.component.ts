import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MarkerType } from '../../models';
import { ImageUtil } from '../../util/ImageUtil';

@Component({
  selector: 'app-edit-marker-type',
  templateUrl: './edit-marker-type.component.html',
  styleUrls: ['./edit-marker-type.component.css']
})
export class EditMarkerTypeComponent implements AfterViewInit {
  @ViewChild('filecontrol') fileButton
  @ViewChild('myimage') myimage
  @Input() selected: MarkerType
  hasImage = false
  constructor() { }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if (this.selected.url) {
      this.hasImage = true
    }
  }

  getFile() {
    console.log(this.fileButton);
    this.fileButton.nativeElement.click()
  }

  setFile(event) {
    if (this.selected && event.target.files) {
      let f = event.target.files[0]
      this.selected["__FILE"] = f
      this.getDimensions(f).subscribe(val => {
        this.selected.iconSize = val
        this.selected.iconAnchor = [Math.round(val[0] / 2), val[1]]
      })
      console.log("FILE")
      console.log(this.selected["__FILE"]);
    }
  }

  getDimensions(f: File): Observable<[number, number]> {
    let val = new ReplaySubject<[number, number]>()
    let reader = new FileReader()
    reader.readAsDataURL(f)
    reader.onloadend = () => {
      this.hasImage = true
      var url = reader.result
      var img = new Image()
      img.src = url.toString()
      img.onload = () => {
        this.myimage.nativeElement.src = img.src
        this.myimage.nativeElement.width = img.width
        this.myimage.nativeElement.height = img.height
        val.next([img.width, img.height])
      }
    }
    return val
  }



}
