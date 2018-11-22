import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ImageAnnotation, MergedMapType, MapConfig } from '../../models';
import { DataService } from '../../data.service';
import { ReplaySubject, Observable, combineLatest } from 'rxjs';
import { ImageResult } from '../../util/ImageUtil';
import { tap } from 'rxjs/operators';

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
    combineLatest(this.data.gameAssets.maps.items$, this.data.gameAssets.mapTypes.items$).subscribe(
      (value) => {
        const maps = value[0]
        const types = value[1]
        let mergedArr = new Array<MergedMapType>()
        types.forEach(mt => {
          let merged = new MergedMapType()
          merged.name = mt.name
          merged.order = mt.order
          merged.id = mt.id
          merged.defaultMarker = mt.defaultMarker
          merged.maps = maps.filter(m => m.mapType == merged.id && this.data.canView(m))
          mergedArr.push(merged)
        })

        let items = mergedArr.sort((a, b) => a.order - b.order)
        this.merged = items
      }
    )
    
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

  dataChanged(image: ImageResult) {
    this.image._blob = image.file
    this.image.url = image.dataURL
    this.image.aspect = image.aspect
    this.image.copyOptionsToShape();
  }

  // fileChanged($event) {
  //   this.image._blob = $event
  // }

  // urlChanged($event) {
  //   this.image.url = $event
  //   this.image.copyOptionsToShape();
  //   this.image._saveImage = true
  // }

  updateImage() {
    this.image.copyOptionsToShape();
  }
}
