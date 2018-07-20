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
      let path = this.item.asItem().getElement()
      let bb = path.getBoundingClientRect()
      let result = (bb.left - this.padding) + " " + (bb.top - this.padding) + " " + (bb.width + 2 * this.padding) + " " + (bb.height + 2 * this.padding)
      return result
    }
    return "0 0 200 100"
  }

  dynamicHeight() {
    if (ShapeAnnotation.is(this.item)) {
      let path = this.item.asItem().getElement()
      let bb = path.getBoundingClientRect()
      let aspect = bb.height / bb.width
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
