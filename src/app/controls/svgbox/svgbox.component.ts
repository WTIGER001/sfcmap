import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { ShapeAnnotation } from '../../models';

@Component({
  selector: 'app-svgbox',
  templateUrl: './svgbox.component.html',
  styleUrls: ['./svgbox.component.css']
})
export class SvgboxComponent {
  constructor() { }

  svgelement: ElementRef
  grpelement: ElementRef
  item: ShapeAnnotation

  @Input() maxheight = 150
  @Input() padding = 20

  @ViewChild('svgdisplay') set svgdisplay(content: ElementRef) {
    this.svgelement = content;
    this.insertSVG()
  }

  @ViewChild('svgholder') set svgholder(content: ElementRef) {
    this.grpelement = content;
    this.insertSVG()
  }

  @Input() set shape(item: ShapeAnnotation) {
    this.item = item
    this.insertSVG()
  }

  viewbox() {
    if (ShapeAnnotation.is(this.item)) {
      let d = this.item.asItem().getElement().getAttribute("d")
      let mod = d.replace(/[a-zA-Z]+/g, " ").trim()
      let parts = mod.split(" ")

      let minX: number = parseInt(parts[0])
      let maxX: number = parseInt(parts[0])
      let minY: number = parseInt(parts[1])
      let maxY: number = parseInt(parts[1])
      for (let i = 2; i < parts.length; i += 2) {
        let x: number = parseInt(parts[i])
        let y: number = parseInt(parts[i + 1])
        maxX = Math.max(x, maxX)
        maxY = Math.max(y, maxY)
        minX = Math.min(x, minX)
        minY = Math.min(y, minY)
      }
      const pad = this.padding

      let result = (minX - pad) + " " + (minY - pad) + " " + ((maxX - minX) + 2 * pad) + " " + ((maxY - minY) + 2 * pad)
      return result
    }
    return "0 0 200 100"
  }

  dynamicHeight() {
    if (ShapeAnnotation.is(this.item)) {
      let d = this.item.asItem().getElement().getAttribute("d")
      let mod = d.replace(/[^0-9]+/g, " ").trim()
      let parts = mod.split(" ")

      let minX: number = parseInt(parts[0])
      let maxX: number = parseInt(parts[0])
      let minY: number = parseInt(parts[1])
      let maxY: number = parseInt(parts[1])
      for (let i = 2; i < parts.length; i += 2) {
        let x: number = parseInt(parts[i])
        let y: number = parseInt(parts[i + 1])
        maxX = Math.max(x, maxX)
        maxY = Math.max(y, maxY)
        minX = Math.min(x, minX)
        minY = Math.min(y, minY)
      }
      let deltaX = (maxX - minX)
      let deltaY = (maxY - minY)
      let aspect = deltaY / deltaX
      return Math.min(200 * aspect, this.maxheight)
    }
    return 100
  }

  private insertSVG() {
    if (this.item) {
      let element = this.item.asItem().getElement()

      // Background Copy
      let backcopy = element.cloneNode(true)
      this.svgelement.nativeElement.appendChild(backcopy)

      // Main Copy
      let copy = element.cloneNode(true)
      this.grpelement.nativeElement.appendChild(copy)
    }
  }

}
