import { Component, OnInit, Input, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { AbstractValueAccessor } from '../value-accessor';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-line-style',
  templateUrl: './line-style.component.html',
  styleUrls: ['./line-style.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: LineStyleComponent, multi: true }
  ]
})
export class LineStyleComponent extends AbstractValueAccessor implements AfterViewInit {
  @Input() patterns = [
    '', 
    '2',
    '4',
    '8',
    '4 8',
    '12',
    '16'
  ]
  @ViewChild('selectedbutton', { static: true }) chooserButton
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
    this.value = this.patterns[index]
    this.change.emit(this.selected)
  }

  getSelectedImage(): SafeUrl {
    let w = 35
    let h = 15
    let v = this.value
    this.selected = this.patterns.findIndex(pattern => v == pattern)
    if (this.selected < 0) {
      return this.generateEmptyImage(w, h)
    } else {
      if (this.simages.has(this.selected)) {
        return this.simages.get(this.selected)
      } else {
        let img = this.generateSelectionImage(this.patterns[this.selected], w, h)
        this.simages.set(this.selected, img)
        return img
      }
    }
  }

  getImage(index: number): SafeUrl {
    if (this.images.has(index)) {
      return this.images.get(index)
    } else {
      let pattern = this.patterns[index]
      let w = 100
      let h = 20
      let img = this.generateImage(pattern, w, h)
      this.images.set(index, img)
      return img
    }
  }

  refresh() {
    let v = this.value
    this.selected = this.patterns.findIndex(pattern => v == pattern)
  }

  generateImage(pattern: string, w: number, h: number): SafeUrl {
    let url = this.drawPattern(pattern, w, h, "#000000");
    return this.sanitizer.bypassSecurityTrustUrl(url)
  }

  private drawPattern(pattern: string, w: number, h: number, color : string) : string {
    console.log("DRAW PATTERN", pattern, w, h)

    let canvas = this.getCanvas()
    canvas.width = w;
    canvas.height = h
    let ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    if (pattern.trim() == '') {
      ctx.moveTo(0, h / 2)
      ctx.lineTo(w, h / 2)
      ctx.stroke()
    } else {
      const dash = pattern.split(" ");
      const dashes = dash.map(d => parseInt(d));
      let total = 0;
      let i = 0;
      let solid = true;
      while (total < w) {
        if (solid) {
          ctx.moveTo(total, h / 2);
          ctx.lineTo(Math.min(total + dashes[i], w), h / 2);
          ctx.stroke();
          total = total + dashes[i];
        }
        else {
          total = total + dashes[i];
        }
        solid = !solid;
        i = (i + 1) >= dashes.length ? 0 : i + 1;
      }
    }
   
    return canvas.toDataURL()
  }

  generateSelectionImage(pattern: string, w: number, h: number): SafeUrl {
    let url = this.drawPattern(pattern, w, h, '#ffffff');
    return this.sanitizer.bypassSecurityTrustUrl(url)
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