import { ICommand, StatelessCommand } from "./ICommand";
import { LatLng } from "leaflet";
import { MapService } from "../map.service";
import { ShapeAnnotation } from "../models";

export class NewMarker extends StatelessCommand implements ICommand {
  name = 'New Marker'
  keyBinding = "ctrl+m"
  icon = "map-marker-alt"
  helpText = "Create a new Marker"

  constructor(private mapSvc: MapService) {
    super()
  }

  execute(event: any, lastMouse: LatLng) {
    let m = this.mapSvc.newTempMarker()
    this.mapSvc.selectForEdit(m)
  }
}

export abstract class NewShapeAnnotationCommand {
  constructor(public mapSvc: MapService) {

  }

  completeShape(s) {
    s.id = 'TEMP'
    s.map = this.mapSvc._mapCfg.id
    s.copyOptionsFromShape()
    // s.getAttachment().on('click', event => {
    //   console.log("CLICKED ON  : ", event);
    //   this.mapSvc.printLayers()
    //   console.log("------>> ", event.target._leaflet_id);
    // }, this)
    this.mapSvc.selectForEdit(s)
  }
}

export class NewPolyLineAnnotationCommand extends NewShapeAnnotationCommand {
  name = 'New Marker'
  keyBinding = "ctrl+l"
  icon = "signature"
  helpText = "Create a new polyline"

  constructor(public mapSvc: MapService) {
    super(mapSvc)
  }

  execute(event: any, lastMouse: LatLng) {
    let s = new ShapeAnnotation('polyline')
    s.name = "New Polyline"
    let shp = this.mapSvc._map.editTools.startPolyline()
    s.setAttachment(shp)
    this.completeShape(s)
  }
}