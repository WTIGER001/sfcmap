import { Distance } from "./units";
import { DistanceUnit } from "../util/transformation";
import { UUID } from "angular2-uuid";

export enum AuraVisible {
  NotVisible = 0,
  Visible = 1,
  OnSelect = 2
}
export enum AuraVisibleTo {
  Everyone = 0,
  Player = 1,
  PlayerAndGm = 2
}

export class Aura {
  id : string = UUID.UUID().toString()
  name: string
  border : boolean = false;
  color: string = '#b52020c5'
  fill : boolean = true
  fillColor: string = '#b52020c5'
  radius: Distance = new Distance(5, DistanceUnit.Feet.abbr)
  visible: number = AuraVisible.NotVisible
  visibleTo : number = AuraVisibleTo.Everyone
  weight: number = 1;
}