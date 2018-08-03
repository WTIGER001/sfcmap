import { enableDebugTools } from "@angular/platform-browser";
import { LatLng } from "leaflet";

export interface IUndoableAction {
  undo: () => void
  redo: () => void
}