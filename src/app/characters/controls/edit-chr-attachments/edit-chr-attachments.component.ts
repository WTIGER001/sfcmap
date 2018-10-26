import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService } from '../../../data.service';
import { Character, Attachment } from '../../../models/character';
import { log } from 'util';

@Component({
  selector: 'app-edit-chr-attachments',
  templateUrl: './edit-chr-attachments.component.html',
  styleUrls: ['./edit-chr-attachments.component.css']
})
export class EditChrAttachmentsComponent implements OnInit {
  @Input() character: Character
  @ViewChild('filecontrol') fileButton

  dragging = false
  maxSize = 10000000
  constructor(private data: DataService) { }

  ngOnInit() {
  }

  getFile() {
    this.fileButton.nativeElement.click()
  }

  uploadFile(event) {
    if (event.target.files) {
      this.setFiles(event.target.files)
    }
  }

  setFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      let f = files[i]
      if (f.size < this.maxSize) {
        let path = 'attachments/' + this.character.id + "/" + f.name
        this.data.uploadFile(path, f).subscribe(
          progress => { },
          error => { },
          () => {
            this.data.pathToUrl(path).subscribe(url => {
              const att = new Attachment()
              att.name = f.name
              att.size = f.size
              att.url = url
              this.character.attachments.push(att)
            })
          }
        )
      }
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
