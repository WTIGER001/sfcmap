import { Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from '../../data.service';
import { ImagesService } from '../../dialogs/images.service';

@Component({
  selector: 'app-edit-picture',
  templateUrl: './edit-picture.component.html',
  styleUrls: ['./edit-picture.component.css']
})
export class EditPictureComponent implements OnInit {
  @Input() maxSize = 10000000
  @Input() picture: string
  @Input() multiple = false
  @Input() searchTerm = ''


  @ViewChild('filecontrolPic') fileButton
  @Output() choice = new EventEmitter()

  dragging = false
  constructor(private data: DataService, private images: ImagesService) { }

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
    const filesToSend = []
    for (let i = 0; i < files.length; i++) {
      let f = files[i]
      if (f.size < this.maxSize) {
        filesToSend.push(f)
      }
    }
    if (filesToSend.length > 0) {
      if (this.multiple) {
        this.choice.emit(filesToSend)
      } else {
        this.choice.emit(filesToSend[0])
      }
    }

  }

  randomImage() {
    this.images.openRandomImage(this.searchTerm).subscribe(result => {
      this.picture = result.url
      this.choice.emit(result)
    })
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
