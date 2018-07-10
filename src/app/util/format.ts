import { DistanceUnit } from "./transformation";

export class Format {
    public static formatArray(arr: string[]): string {
        var outStr = "";
        if (arr.length === 1) {
            outStr = arr[0];
        } else if (arr.length === 2) {
            //joins all with "and" but no commas
            //example: "bob and sam"
            outStr = arr.join(' and ');
        } else if (arr.length > 2) {
            //joins all with commas, but last one gets ", and" (oxford comma!)
            //example: "bob, joe, and sam"
            outStr = arr.slice(0, -1).join(', ') + ', and ' + arr.slice(-1);
        }
        return outStr;
    }

    public static formatDistance(distanceM: number, unit?: DistanceUnit): string {
        if (!unit) {
            // Select the best unit. This is just the smallest number that is greater than 10
            let u = undefined
            let d = Infinity
            DistanceUnit.units.forEach(du => {
                let myDistance = du.fromMeters(distanceM)
                if (myDistance > 10 && myDistance < d) {
                    u = du
                    d = myDistance
                }
            })
            unit = u
        }

        // let distStr = unit.fromMeters(distanceM).toFixed(1)
        // return distStr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (unit) {
            return unit.fromMeters(distanceM).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " " + unit.abbr
        }
        return distanceM.toLocaleString(undefined, { maximumFractionDigits: 2 }) + " UNK"

    }
}