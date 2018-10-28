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
}