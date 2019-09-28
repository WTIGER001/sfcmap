import { DistanceUnit } from "../util/transformation";

export class Distance {
    constructor(public value: number, public unit: string) {
    }

    static toMeters(distance : Distance) {
      const foundUnit = DistanceUnit.getUnit(distance.unit)
      if (foundUnit) {
        return foundUnit.toMeters(distance.value)
      }
      return distance.value
    }

    asMeters() : number {
      return Distance.toMeters(this)
    }

    fromMeters(val : number) {
      console.log("FROM METERS", val);
      
      const foundUnit = DistanceUnit.getUnit(this.unit)
      if (foundUnit) {
        this.value = foundUnit.fromMeters(val)
      } else {
        console.error("No Unit found", this.unit);
      }
    }
}