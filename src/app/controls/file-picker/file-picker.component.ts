import { Component, OnInit, ViewChild, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable, Subject } from 'rxjs';
import { ImageUtil, ImageResult } from '../../util/ImageUtil';

@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.css']
})
export class FilePickerComponent implements OnInit {
  @ViewChild('filecontrol') fileButton
  @ViewChild('myimage') myimage

  @Input() src: string
  // @Output() filechanged = new EventEmitter();
  @Output() datachanged = new EventEmitter();
  // @Output() urlchanged = new EventEmitter();
  img: HTMLImageElement
  data: ImageResult
  dragging = false

  id = UUID.UUID().toString

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if (this.src) {
      this.myimage.nativeElement.src = this.src
    }
  }

  hasImage() {
    return this.src !== undefined
  }

  getFile() {
    console.log("Clicking on File");
    this.fileButton.nativeElement.click()
  }

  uploadFile(event) {
    if (event.target.files) {
      this.setFile(event.target.files[0])
    }
  }

  setFile(f) {
    ImageUtil.loadImg(f).subscribe(r => {
      this.data = r
      this.myimage.nativeElement.src = r.dataURL
      this.datachanged.emit(r)
    })
  }

  dragOver(e) {
    // console.log("OVER");

    // e.stopPropagation();
    e.preventDefault();
  }

  dragEnter(e) {
    console.log("ENTER");

    // e.stopPropagation();
    e.preventDefault();
    this.dragging = true
  }

  dragLeave(e) {
    console.log("LEAVING");

    // e.stopPropagation();
    e.preventDefault();
    this.dragging = false
  }

  drop(e) {
    e.stopPropagation();
    e.preventDefault();
    this.dragging = false

    const files = e.dataTransfer.files;
    if (files.length >= 1) {
      this.setFile(files[0])
    }
    return false;
  }

}