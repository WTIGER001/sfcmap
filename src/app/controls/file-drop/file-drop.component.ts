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
    this.fileschanged.emit(files)
  }

  getFile() {
    this.fileButton.nativeElement.click()
  }

  uploadFile(event) {
    if (event.target.files) {
      this.setFiles(event.target.files)
    }
  }

  dragOver(e) {
    e.preventDefault();
  }

  dragEnter(e) {
    e.preventDefault();
    this.dragging = true
  }

  dragLeave(e) {
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
