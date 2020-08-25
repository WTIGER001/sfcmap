import { Component, OnInit, Input, ViewChild, Sanitizer } from '@angular/core';
import { MapConfig } from 'src/app/models';
import { ImagesService } from 'src/app/dialogs/images.service';
import { ImageUtil, ImageResult } from 'src/app/util/ImageUtil';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonDialogService } from 'src/app/dialogs/common-dialog.service';
import { LangUtil } from 'src/app/util/LangUtil';
import { LoadingComponent } from 'src/app/controls/loading/loading.component';

@Component({
  selector: 'app-new-map-wizard-image-pg',
  templateUrl: './new-map-wizard-image-pg.component.html',
  styleUrls: ['./new-map-wizard-image-pg.component.css']
})
export class NewMapWizardImagePgComponent implements OnInit {
  @Input() map: MapConfig
  @Input() maxSize = 50000000
  @ViewChild('filecontrolPic', { static: true }) fileButton
  @ViewChild('loading', { static: true }) loading : LoadingComponent
  @Input() searchTerm = 'fantasy rpg map'
  result : ImageResult
  dragging = false

  constructor(private images: ImagesService, private dialog : CommonDialogService) { }

  ngOnInit() {
  }

  async pasteUrl() {
    const regex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/
    try {
      const text : string = await navigator['clipboard'].readText();
      console.log('Pasted content: ', text);
      if (text && text.match(regex)) {
        // this.map.image = text
        this.loadUrl(text)
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  }

  getFile() {
    this.fileButton.nativeElement.click()
  }

  uploadFile(event) {
    if (event.target.files) {
      console.log("upLoading Files", event.target.files.length)
      this.setFiles(event.target.files)
    }
  }

  setFiles(files: FileList) {
    const filesToSend = []
    if (files.length > 0) {
      let f = files[0]
      if (f.size < this.maxSize) {
        this.loadFile(f)
      } else {
        const fmtSize = LangUtil.humanFileSize(f.size)
        const fmtMax = LangUtil.humanFileSize(this.maxSize)
        this.dialog.errorMsg(`File is too big. This file is ${fmtSize} bytes and the max size allowed is ${fmtMax}`, "File Too Large!")
      }
    }
  }

  loadUrl(url : string) {
    this.loading.start()
    ImageUtil.loadImgFromUrl(url, { createThumbnail: true, thumbnailKeepAspect: true, thumbnailMaxHeight: 400 }).subscribe( result => {
      this.result = result;
      this.map.image = url
      this.map._IMG = result
      this.map.height = result.height
      this.map.width = result.width
      this.loading.stop()
    } )
  }

  loadFile(f : File) {
    console.log("Loading File", f)
    this.loading.start()
    ImageUtil.loadImg(f, { createThumbnail: true, thumbnailKeepAspect: true, thumbnailMaxHeight: 400}).subscribe( result => {
      this.result = result; 
      this.map.image = result.dataURL
      this.map._IMG = result
      this.map.height = result.height
      this.map.width = result.width
      this.loading.stop()
    })
  }

  randomImage() {
    this.images.openRandomImage(this.searchTerm).subscribe(result => {
      // this.map.image = result.url
      this.loadUrl(result.url)
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

  canNext(): boolean {
    return this.map.image != undefined && this.map._IMG != undefined
  }
}
