import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractValueAccessor } from '../value-accessor';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-line-weight',
  templateUrl: './line-weight.component.html',
  styleUrls: ['./line-weight.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: LineWeightComponent, multi: true }
  ]
})
export class LineWeightComponent extends AbstractValueAccessor implements AfterViewInit {
  @Input() weights = [1.0, 2, 3, 4, 5, 6, 7, 8]
  @ViewChild('selectedbutton') chooserButton
  @Output() change = new EventEmitter()
  emptyImage
  selected: number = 0
  canvas: HTMLCanvasElement

  images = new Map<number, SafeUrl>()
  simages = new Map<number, SafeUrl>()

  constructor(private sanitizer: DomSanitizer) {
    super()
  }

  ngAfterViewInit() {
    this.refresh()
  }

  select(index: number) {
    console.log("Selecting ", index);
    this.selected = index
    this.value = this.weights[index]
    this.change.emit(this.selected)
  }

  getSelectedImage(): SafeUrl {
    let w = 35
    let h = 15
    let v = this.value
    this.selected = this.weights.findIndex(weight => v == weight)
    if (this.selected < 0) {
      return this.generateEmptyImage(w, h)
    } else {
      if (this.simages.has(this.selected)) {
        return this.simages.get(this.selected)
      } else {
        let img = this.generateSelectionImage(this.selected, w, h)
        this.simages.set(this.selected, img)
        return img
      }
    }
  }

  getImage(index: number): SafeUrl {
    if (this.images.has(index)) {
      return this.images.get(index)
    } else {
      let weight = this.weights[index]
      let w = 100
      let h = 20
      let img = this.generateImage(weight, w, h)
      this.images.set(index, img)
      return img
    }
  }

  refresh() {
    let v = this.value
    this.selected = this.weights.findIndex(weight => v == weight)
  }

  generateImage(lineWeight: number, w: number, h: number): SafeUrl {
    let canvas = this.getCanvas()
    canvas.width = w;
    canvas.height = h
    let ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = lineWeight
    ctx.beginPath()
    ctx.moveTo(0, h / 2)
    ctx.lineTo(w, h / 2)
    ctx.stroke()
    let url = canvas.toDataURL()
    return this.sanitizer.bypassSecurityTrustUrl(canvas.toDataURL())
  }

  generateSelectionImage(lineWeight: number, w: number, h: number): SafeUrl {
    let canvas = this.getCanvas()
    canvas.width = w;
    canvas.height = h
    let ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = lineWeight
    ctx.beginPath()
    ctx.moveTo(0, h / 2)
    ctx.lineTo(w, h / 2)
    ctx.stroke()
    let url = canvas.toDataURL()
    return this.sanitizer.bypassSecurityTrustUrl(canvas.toDataURL())
  }

  generateEmptyImage(w: number, h: number): SafeUrl {
    let canvas = this.getCanvas()
    canvas.width = w;
    canvas.height = h
    let ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, w, h)
    return this.sanitizer.bypassSecurityTrustUrl(canvas.toDataURL())
  }

  getCanvas(): HTMLCanvasElement {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas')
    }
    return this.canvas;
  }

}
