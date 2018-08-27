import { IUndoableAction } from "./IUndoableAction";
import { MapService } from "../maps/map.service";
import { Selection, Annotation } from "../models";
import { DataService } from "../data.service";
import { LatLng } from "leaflet";
import { CommonDialogService } from "../dialogs/common-dialog.service";
import { Observable, of } from "rxjs";
import { ICommand } from "./ICommand";
import { Format } from "../util/format";

export class DeleteCommand implements ICommand {
  keyBinding = 'delete'
  name = 'Delete'
  icon = 'trash';
  helpText = "Delete the selected object(s)";
  selection: Selection

  constructor(private mapSvc: MapService, private data: DataService, private dialog: CommonDialogService) {
    this.mapSvc.selection.subscribe(sel => {
      this.selection = sel
    })
  }

  execute(event: any, lastMouse: LatLng) {
    let names = []
    this.selection.items.forEach(m => {
      if (Annotation.is(m)) {
        names.push(m.name)
      }
    })
    let namesTxt = Format.formatArray(names)
    this.dialog.confirm("Are you sure you want to delete " + namesTxt + "?", "Confirm Delete").subscribe(result => {
      if (result) {
        this.data.deleteAll(...this.selection.items)
        this.mapSvc.select()
      }
    })
  }

  canActivate(event?: any) {
    return false
  }

  isActive(event?: any): boolean {
    return !this.selection.isEmpty()
  }

  enable() {

  }

  disable() {

  }


}