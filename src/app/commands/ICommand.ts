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