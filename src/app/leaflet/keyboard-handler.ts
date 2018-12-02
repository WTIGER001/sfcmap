import { Handler, DomEvent, Map } from "leaflet";
import { MapConfig, TokenAnnotation, Annotation } from "../models";
import { NgZone } from "@angular/core";
import { DataService } from "../data.service";
import { MapService } from "../maps/map.service";
import { DistanceUnit } from "../util/transformation";
import { BoundsUtil } from "../util/geom";

export class KeyboardHandler implements Handler {

  _enabled = false

  triggers = [
    // DOWN LEFT, numpad 1, #1
    new Direction(1, 49, 97),

    // DOWN, down arrow, numpad 2, #2, s
    new Direction(2, 40, 98, 50, 83),

    // DOWN RIGHT, numpagd 3, #3
    new Direction(3, 99, 51),

    // LEFT, left arrow, numpagd 4, #4, a
    new Direction(4, 37, 100, 52, 65),

    // RIGHT, right arrow, numpad 6, #6, d
    new Direction(6, 39, 102, 54, 68),

    // UP LEFT, numpagd 7, #7,
    new Direction(7, 103, 55),

    // UP, up arrow, numpad 8, #8, w
    new Direction(8, 38, 104, 56, 87),

    // UP RIGHT,  numpad 9, #9
    new Direction(9, 105, 57),
  ]



  constructor(private map: Map, private data: DataService, private mapSvc: MapService) {

  }

  enable(): this {
    this.addHooks()
    this._enabled = true
    return this
  }

  disable(): this {
    this.removeHooks()
    this._enabled = true
    return this
  }

  enabled(): boolean {
    return this._enabled
  }

  addHooks?(): void {
    console.log("Adding Hooks for keyboard")
    var container = this.map.getContainer();

    // make the container focusable by tabbing
    if (container.tabIndex <= 0) {
      container.tabIndex = 0;
    }

    // May need to add and remove these when the map container gets focus and looses focus. TBD
    DomEvent.on(this.map.getContainer(), 'keydown', this.keydown, this)
  }

  removeHooks?(): void {
    DomEvent.off(this.map.getContainer(), 'keydown', this.keydown, this)
  }

  keydown(e: any) {
    console.log("Checking for Move", e.keyCode)

    const sel = this.mapSvc.selection.getValue()

    if (sel && !sel.isEmpty()) {
      sel.items.forEach( item => {
        // The selection can be disconnect from the instance of the token if a change has happened
        if (TokenAnnotation.is(item)) {
          const ta = this.find(item.id)
          // figure out which (if any) direction is triggered
          const direction = this.triggers.find(t => t.matches(e))
          if (direction) {
            this.move(ta, direction.direction, 5, DistanceUnit.Feet)
          }
        }
      })
    }
  }

  move(token: TokenAnnotation, direction: number, distance: number, unit: DistanceUnit) {
    const distanceM = unit.toMeters(distance)

    const bounds = token.asItem().getBounds()
    const newBounds = BoundsUtil.offset(bounds, direction, distance, unit)
    token.points = [
      newBounds.getSouthWest(),
      newBounds.getNorthEast()
    ]
    this.data.save(token)
  }

  find(id: string): TokenAnnotation {
    let rtn: TokenAnnotation
    this.map.eachLayer(l => {
      if (this.isToken(l)) {
        const token: TokenAnnotation = this.getItemFromLayer(l)
        if (token && token.id == id) {
          rtn = token
        }
      }
    })
    return rtn
  }

  isToken(l: any): boolean {
    const annotation = <Annotation>l.objAttach
    if (annotation && TokenAnnotation.is(annotation)) {
      return true
    }
  }

  getItemFromLayer(l: any): TokenAnnotation {
    const annotation = <Annotation>l.objAttach
    if (annotation && TokenAnnotation.is(annotation)) {
      return annotation
    }
    return undefined
  }
}

class Direction {
  codes: number[]
  constructor(public direction: number, ...codes: number[]) {
    this.codes = codes
  }

  matches(e: any) {
    return this.codes.includes(e.keyCode)
  }
}