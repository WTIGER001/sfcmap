import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.css']
})
export class FileDropComponent implements OnInit {

  @ViewChild('filecontrol') fileButton
  @Output() fileschanged = new EventEmitter()

  dragging = false
  maxSize = 10000000
  constructor() { }

  ngOnInit() {
  }

  setFiles(files: FileList) {
    console.log(files);
    this.fileschanged.emit(files)

  }

  getFile() {
    console.log("Clicking on File");
    this.fileButton.nativeElement.click()
  }

  uploadFile(event) {
    if (event.target.files) {
      this.setFiles(event.target.files)
    }
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
      this.setFiles(files)
    }
    return false;
  }
}
