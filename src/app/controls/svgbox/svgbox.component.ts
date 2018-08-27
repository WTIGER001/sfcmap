import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { ShapeAnnotation } from '../../models';
import { MapService } from '../../maps/map.service';
import { Map, PointExpression, Point, LatLng } from 'leaflet';
import { Rect } from '../../util/geom';

@Component({
  selector: 'app-svgbox',
  templateUrl: './svgbox.component.html',
  styleUrls: ['./svgbox.component.css']
})
export class SvgboxComponent {
  map: Map
  constructor(private mapSvc: MapService) {
    this.mapSvc.map.subscribe(m => {
      this.map = m
    })
  }

  svgitem: Element
  svgelement: ElementRef
  svgelement2: ElementRef
  grpelement: ElementRef
  item: ShapeAnnotation

  @Input() maxheight = 150
  @Input() padding = 20

  @ViewChild('svgdisplay') set svgdisplay(content: ElementRef) {
    this.svgelement = content;
    this.insertSVG()
  }

  @ViewChild('svgdisplay2') set svgdisplay2(content: ElementRef) {
    this.svgelement2 = content;
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


  pathBounds(d: string): Rect {
    let d_1 = d.replace(/[,zM]/g, " ").trim()
    let parts = d_1.split(/[Laz]/)

    if (d_1.includes("a")) {
      let move = this.extractPoint(parts[0])
      let h = this.extractArc(parts[1])
      return new Rect(move[0], move[1] - h, h * 2, h * 2)
    } else {
      let p = this.extractPoint(parts[0])
      let minX: number = p[0]
      let maxX: number = p[0]
      let minY: number = p[1]
      let maxY: number = p[1]
      for (let i = 0; i < parts.length; i += 1) {
        p = this.extractPoint(parts[i])
        maxX = Math.max(p[0], maxX)
        maxY = Math.max(p[1], maxY)
        minX = Math.min(p[0], minX)
        minY = Math.min(p[1], minY)
      }
      return Rect.fromEnds(minX, minY, maxX, maxY)
    }
  }

  extractArc(part: string): number {
    let parts = part.split(" ")
    let y = parts[1]
    return parseInt(y)
  }

  extractPoint(part: string): [number, number] {
    let parts = part.split(" ")
    let x = parts[0]
    let y = parts[1]
    return [parseInt(x), parseInt(y)]
  }

  viewbox() {
    if (ShapeAnnotation.is(this.item)) {
      let path = this.svgitem
      if (path) {
        let d = path.getAttribute("d")
        let bounds = this.pathBounds(d)
        let padded = Rect.pad(bounds, this.padding)

        return padded.x + " " + padded.y + " " + padded.width + " " + padded.height
      }
    }
    return "0 0 200 100"
  }

  dynamicHeight() {
    if (ShapeAnnotation.is(this.item)) {
      let path = this.svgitem
      if (path) {
        let bb = this.pathBounds(path.getAttribute('d'))
        let aspect = bb.height / bb.width
        return Math.min(200 * aspect, this.maxheight)
      }
    }
    return 100
  }

  private insertSVG() {
    if (this.item && this.item.asItem()) {
      let element = this.item.asItem().getElement()
      this.svgitem = element

      // Background Copy
      let backcopy = element.cloneNode(true)
      this.svgelement.nativeElement.appendChild(backcopy)

      // Main Copy
      let copy = element.cloneNode(true)
      this.svgelement2.nativeElement.appendChild(copy)
    }
  }

}
