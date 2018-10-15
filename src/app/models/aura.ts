import { Distance } from "./units";
import { DistanceUnit } from "../util/transformation";

export class Aura {
  name: string
  color : string
  radius: Distance = new Distance(5, DistanceUnit.Feet.abbr)
  visible: boolean
}