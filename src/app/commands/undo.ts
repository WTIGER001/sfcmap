import { ICommand } from "./ICommand";
import { LatLng } from "leaflet";
import { Observable } from "rxjs";
import { IUndoableAction } from "./IUndoableAction";
import { UndoRedoService } from "../undo-redo.service";

export class UndoCommand implements ICommand {
  keyBinding = "ctrl+z"
  name = "undo"
  icon = "undo"
  helpText = "undo last action"

  constructor(private undo: UndoRedoService) { }

  execute(event: any, lastMouse: LatLng) {
    this.undo.undo()
  }

  canActivate(event?: any) {
    return this.undo.canUndo()
  }

  isActive(event?: any): boolean {
    return false
  }

  enable() {
  }

  disable() {

  }


}