import { MapConfig } from "../models";
import { CRS } from "leaflet";
import * as L from 'leaflet';

export class DistanceUnit {
    public static units = []
    public static readonly M = new DistanceUnit('Meter', "m", 1)
    public static readonly KM = new DistanceUnit('Kilometer', "km", 1000)
    public static readonly Feet = new DistanceUnit('Feet', "ft", 0.3048)
    public static readonly Yard = new DistanceUnit('Yard', "yd", 0.9144)
    public static readonly Mile = new DistanceUnit('Mile', "mi", 1609.344)

    constructor(public readonly name: string, public readonly abbr: string, public readonly meters: number) {
        DistanceUnit.units.push(this)
    }

    public toMeters(value: number) {
        return this.meters * value
    }

    public fromMeters(value: number) {
        return value / this.meters
    }

    public static getUnit(nameOrAbbr: string): DistanceUnit {
        let found
        DistanceUnit.units.forEach(u => {
            if (u.name.toLowerCase() == nameOrAbbr.toLowerCase() || u.abbr.toLowerCase() == nameOrAbbr.toLowerCase()) {
                found = u
            }
        })
        return found
    }
}

export class Trans {
    /**
     * 
     * @param distance Calculate the Pixels per Meter
     * @param pixels 
     */
    public static computePPM(distance: number, pixels: number) {
        return pixels / distance
    }

    public static computeFactor(mapCfp: MapConfig): number {
        let factor = 1
        if (mapCfp.ppm && mapCfp.ppm != 0) {
            console.log("PPM ", mapCfp.ppm);

            return mapCfp.ppm
        }
        return factor
    }

    public static createTransform(mapCfp: MapConfig): L.Transformation {
        let factor = this.computeFactor(mapCfp)
        return new L.Transformation(factor, 0, -factor, 0)
    }

    public static createCRS(mapCfp: MapConfig): any {
        let factor = this.computeFactor(mapCfp)
        return this.createManualCRS(factor)
    }

    public static createManualCRS(factor: number): any {
        // Factors are the number of meters per pixel
        let myCrs = {
            projection: L.Projection.LonLat,
            transformation: new L.Transformation(factor, 0, -factor, 0),
            // Changing the transformation is the key part, everything else is the same.
            // By specifying a factor, you specify what distance in meters one pixel occupies (as it still is CRS.Simple in all other regards).
            // In this case, I have a tile layer with 256px pieces, so Leaflet thinks it's only 256 meters wide.
            // I know the map is supposed to be 2048x2048 meters, so I specify a factor of 0.125 to multiply in both directions.
            // In the actual project, I compute all that from the gdal2tiles tilemapresources.xml, 
            // which gives the necessary information about tilesizes, total bounds and units-per-pixel at different levels.
            zoom: function (scale) { },
            scale: function (zoom) { },
            distance: function (latlng1, latlng2) { },
            infinite: true
        }

        L.Util.extend(myCrs, L.CRS.Simple);

        myCrs.transformation = new L.Transformation(factor, 0, -factor, 0)

        myCrs.scale = function (zoom) {
            return Math.pow(2, zoom);
        }

        myCrs.zoom = function (scale) {
            return Math.log(scale) / Math.LN2;
        }

        myCrs.distance = function (latlng1, latlng2) {
            var dx = latlng2.lng - latlng1.lng,
                dy = latlng2.lat - latlng1.lat;

            return Math.sqrt(dx * dx + dy * dy);
        }

        myCrs.infinite = true

        return myCrs
    }
}
