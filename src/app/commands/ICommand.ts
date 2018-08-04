import { LatLng } from "leaflet";
import { IUndoableAction } from "./IUndoableAction";
import { Observable } from "rxjs";

export interface ICommand {
  keyBinding?: string
  name: string
  icon?: string
  helpText?: string

  canActivate(event?: any)
  isActive(event?: any): boolean
  execute(event: any, lastMouse: LatLng)
  enable();
  disable();
}

export abstract class StatelessCommand {
  canActivate(event?: any) {
    return false
  }
  isActive(event?: any): boolean {
    return false
  }

  enable() {

  }
  disable() {
  }
}