import { LatLng } from "leaflet";
import { Observable } from "rxjs";
import { IUndoableAction } from "./IUndoableAction";
import { UndoRedoService } from "../undo-redo.service";
import { ICommand } from "./ICommand";

export class RedoCommand implements ICommand {
  keyBinding = "ctrl+y"
  name = "redo"
  icon = "redo"
  helpText = "Redo last action"

  constructor(private undo: UndoRedoService) { }

  execute(event: any, lastMouse: LatLng) {
    this.undo.redo()
  }

  canActivate(event?: any) {
    return this.undo.canRedo()
  }

  isActive(event?: any): boolean {
    return false
  }

  enable() {
  }

  disable() {

  }


}