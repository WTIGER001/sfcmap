import { Component, OnInit, ViewChild, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.css']
})
export class FilePickerComponent implements OnInit {
  @ViewChild('filecontrol') fileButton
  @ViewChild('myimage') myimage

  @Input() src: string
  @Output() filechanged = new EventEmitter();
  @Output() urlchanged = new EventEmitter();
  img: HTMLImageElement

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

  setFile(event) {
    if (event.target.files) {
      let f = event.target.files[0]
      this.getDimensions(f).subscribe(val => {
        this.filechanged.emit(f)
      })
    }
  }

  getDimensions(f: File): Observable<[number, number]> {
    // let canvas = <HTMLCanvasElement>this.myimage.nativeElement
    let val = new Subject<[number, number]>()
    let reader = new FileReader()
    reader.readAsDataURL(f)
    reader.onloadend = () => {
      this.src = reader.result
      this.img = new Image()
      this.img.src = this.src

      this.urlchanged.emit(this.src)
      this.img.onload = () => {
        this.myimage.nativeElement.src = this.img.src
        // this.myimage.nativeElement.width = this.img.width
        // this.myimage.nativeElement.height = this.img.height
        val.next([this.img.width, this.img.height])
        val.complete()
      }
    }
    return val
  }
}