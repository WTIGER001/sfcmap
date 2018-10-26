import { Component, OnInit, Input, ViewChild, NgZone, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { MapConfig } from '../../models';
import { Util } from 'leaflet';
import { ImageUtil, ImageResult } from '../../util/ImageUtil';
import { DataService } from '../../data.service';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-edit-map',
  templateUrl: './edit-map.component.html',
  styleUrls: ['./edit-map.component.css']
})
export class EditMapComponent implements OnInit, AfterViewInit {
  selected: MapConfig
  result: ImageResult
  thumbnail
  doneInit = false
  @ViewChild('filecontrol') fileButton
  @ViewChild('mycanvas') canvas

  @Output() changes = new EventEmitter<MapConfig>()
  @Output() imageChanges = new EventEmitter<ImageResult>()

  @Input() set map(input: MapConfig) {
    let copy = new MapConfig()
    Util.extend(copy, input)
    this.selected = copy

    if (input.id != 'TEMP') {
      this.data.thumb(this.selected).subscribe(
        url => {
          this.thumbnail = url
          this.loadImage()
        }
      )
    }
  }

  constructor(private zone: NgZone,
    private data: DataService) {

  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.doneInit = true
    this.loadImage()
  }

  private loadImage() {
    if (this.thumbnail && this.doneInit) {
      ImageUtil.loadImage(this.canvas.nativeElement, this.thumbnail)
    }
  }

  ngOnInit() {
  }

  getFile() {
    this.fileButton.nativeElement.click()
  }

  setFile(event) {
    if (this.selected) {
      let f = event.target.files[0]
      ImageUtil.processFile(this.canvas.nativeElement, f).subscribe(val => {
        this.zone.run(() => {
          this.result = val
          this.selected.height = val.height
          this.selected.width = val.width
        })
      })
    }
  }

  save() {
    if (this.selected) {
      if (this.selected.id == 'TEMP') {
        this.selected.id = UUID.UUID().toString()
      }
      if (this.result) {
        this.data.saveMap(this.selected, this.result.image, this.result.thumb)
      } else {
        this.data.saveMap(this.selected)
      }
    }
  }
}
