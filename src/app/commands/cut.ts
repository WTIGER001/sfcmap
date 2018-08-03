import { isReactNative } from "@firebase/util";
import { ICommandName } from "selenium-webdriver";
import { IUndoableAction } from "./IUndoableAction";
import { MapService } from "../map.service";
import { Selection, Annotation } from "../models";
import { LangUtil } from "../util/LangUtil";
import { LatLng } from "leaflet";
import { Observable, of } from "rxjs";
import { ICommand } from "./ICommand";
import { DataService } from "../data.service";


export class CutCommand implements ICommand {
  name = "cut"
  keyBinding = 'CTRL+X'
  icon?: 'cut'
  helpText?: 'Cut a selected item';
  enabled = false
  selection: Selection

  constructor(private mapSvc: MapService, private data: DataService) {
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

    this.data.deleteAll(...items)

    console.log("Copied to clip board: ", jsonObject);
  }

  enable() {

  }

  disable() {

  }
}