import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Character } from '../../../models/character';
import { DataService } from '../../../data.service';
import { GoogleImageSearch, ImageSearchResult } from '../../../util/GoogleImageSearch';
import { ImagesService } from '../../../dialogs/images.service';
import { positionElements } from '@ng-bootstrap/ng-bootstrap/util/positioning';

@Component({
  selector: 'app-chr-picture',
  templateUrl: './chr-picture.component.html',
  styleUrls: ['./chr-picture.component.css']
})
export class ChrPictureComponent implements OnInit {
  @Input() character: Character
  @ViewChild('filecontrol', { static: true }) fileButton
  dragging = false

  maxSize = 10000000
  constructor(private data: DataService, private imgSvc: ImagesService) { }

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

  randomImage() {
    let term = "fighter human "
    if (this.character.tags && this.character.tags.length > 0) {
      term = this.character.tags.join(' ')
    }
    term += " fantasy art"

    this.imgSvc.openRandomImage(term).subscribe(result => {
      this.character.picture = result.url
    })
  }

  setImgPosition(pos) {
    this.character.imagePos = pos
  }

  setFiles(files: FileList) {
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

  saveToken(f : File) {
    if (f.size < this.maxSize) {
      let path = 'attachments/' + this.character.id + "/token"
      this.data.uploadFile(path, f).subscribe(
        progress => { },
        error => { },
        () => {
          this.data.pathToUrl(path).subscribe(url => {
            this.character.token = url
          })
        }
      )
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

  setToken($event : any) {
    this.saveToken($event)
  }
}
