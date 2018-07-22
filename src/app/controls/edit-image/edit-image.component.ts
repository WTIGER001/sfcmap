import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ImageAnnotation, MergedMapType, MapConfig } from '../../models';
import { DataService } from '../../data.service';
import { ReplaySubject, Observable } from 'rxjs';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.css']
})
export class EditImageComponent {

  @Input() image: ImageAnnotation
  @Input() map: MapConfig
  @Output() changes = new EventEmitter<ImageAnnotation>()

  merged: MergedMapType[] = []

  constructor(private data: DataService) {
    this.data.mapTypesWithMaps.subscribe(items => {
      this.merged = items
    })
  }

  save() {
    //Determine if we need to save the image
    this.image.copyOptionsFromShape()
    if (this.image._saveImage) {
      this.data.saveImageAnnotation(this.image)
    } else {
      this.data.save(this.image)
    }
  }

  hasImage() {
    return (this.image.url && this.image.url.length > 0)
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // if (this.image.url) {
    //   this.hasImage = true
    // }
  }

  fileChanged($event) {
    this.image._blob = $event
  }

  urlChanged($event) {
    this.image.url = $event
    this.image.copyOptionsToShape();
    this.image._saveImage = true
  }

  updateImage() {
    this.image.copyOptionsToShape();
  }
}
