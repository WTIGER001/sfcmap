import { IUndoableAction } from "./IUndoableAction";
import { MapService } from "../map.service";
import { Annotation, ShapeAnnotation } from "../models";
import { Map as LeafletMap, LatLng } from "leaflet";
import { isArray } from "util";
import { Points } from "../util/geom";
import { ICommand } from "./ICommand";
import { Subject } from "rxjs";
import { UUID } from "angular2-uuid";
import { DataService } from "../data.service";


export class PasteCommand implements ICommand {
  name = 'paste'
  keyBinding = 'CTRL+V'
  icon?: 'paste'
  helpText?: 'Paste a copied item';
  enabled = false
  map: LeafletMap

  constructor(private mapSvc: MapService, private data: DataService) {
    this.mapSvc.map.subscribe(m => this.map = m)
  }

  canActivate(event?: any) {
    return true
  }

  isActive(event?: any): boolean {
    return false
  }

  execute(event: any, lastMouse: LatLng, ) {
    event.preventDefault()

    const sub = new Subject<IUndoableAction>()
    this.getClipboardContents().then(text => {
      console.log("GOT DATA : ", text);
      let obj = JSON.parse(text)
      let items = []
      if (isArray(obj)) {
        obj.forEach(item => {
          if (Annotation.is(item)) {
            let annotation = Annotation.to(item)
            annotation.id = UUID.UUID().toString()
            annotation.name = "Copy of " + annotation.name
            const offsetLast = (ShapeAnnotation.is(annotation) && annotation.type == 'circle')
            const points = Points.centerOn(lastMouse, annotation.points)
            annotation.points = points
            this.mapSvc.saveAnnotation(annotation)
            items.push(annotation)
          }
        })
        // this.mapSvc.selectForEdit(...items)
      }
    })
    return sub
  }

  async getClipboardContents() {
    try {
      const text = await navigator['clipboard'].readText();
      console.log('Pasted content: ', text);
      return text
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  }

  enable() {
    // if (this.map) {
    //   const c = this.map.getContainer()
    //   DomEvent.on(c, 'paste', this.execute, this)
    // }
  }

  disable() {
    // if (this.map) {
    //   const c = this.map.getContainer()
    //   DomEvent.off(c, 'paste', this.execute, this)
    // }
  }


}
