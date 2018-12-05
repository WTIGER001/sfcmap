import { LatLng } from "leaflet";
import { MapService } from "../maps/map.service";
import { Annotation, Selection } from "../models";
import { LangUtil } from "../util/LangUtil";
import { ICommand } from "./ICommand";


export class CopyCommand implements ICommand {
  name = "copy"
  keyBinding = 'CTRL+C'
  icon?: 'copy'
  helpText?: 'Copy a selected item';
  enabled = false
  selection: Selection

  constructor(private mapSvc: MapService) {
    this.mapSvc.selection.subscribe(sel => {
      this.selection = sel
      this.enabled = sel.isEmpty()
    })
  }

  canActivate(event?: any) {
    return this.enabled
  }

  isActive(event?: any): boolean {
    return false
  }

  execute(event: any, lastMouse: LatLng) {
    const items = []
    const sel = this.selection
    sel.items.forEach(item => {
      if (Annotation.is(item)) {
        let copiedItem = LangUtil.prepareForStorage(item)
        items.push(copiedItem)
      }
    })

    const jsonObject = JSON.stringify(items)
    navigator['clipboard'].writeText(jsonObject)
    console.log("Copied to clip board: ", jsonObject);
  }

  enable() {

  }

  disable() {

  }
}