import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Character } from '../../../models/character';
import { DataService } from '../../../data.service';

@Component({
  selector: 'app-chr-picture',
  templateUrl: './chr-picture.component.html',
  styleUrls: ['./chr-picture.component.css']
})
export class ChrPictureComponent implements OnInit {
  @Input() character: Character
  @ViewChild('filecontrol') fileButton
  dragging = false

  maxSize = 10000000
  constructor(private data: DataService) { }

  ngOnInit() {
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

  setFiles(files: FileList) {
    console.log(files);

    let f = files[0]
    if (f.size < this.maxSize) {
      let path = 'attachments/' + this.character.id + "/picture"
      this.data.uploadFile(path, f).subscribe(
        progress => { },
        error => { },
        () => {
          this.data.pathToUrl(path).subscribe(url => {
            this.character.picture = url
          })
        }
      )
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
