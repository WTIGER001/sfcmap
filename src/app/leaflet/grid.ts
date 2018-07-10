import { LayerGroup, Map, polyline, latLng, PolylineOptions } from "leaflet";
import { DistanceUnit } from "../util/transformation";
import { MapService } from "../map.service";

export class GridLayer extends LayerGroup {
    options = new GridOptions()
    map: Map

    constructor(private mapSvc: MapService) {
        super()
    }

    onAdd(map: Map): this {
        this.map = map
        map.on('viewreset move', this.refresh, this)
        this.refresh()
        return this
    }

    onRemove(map: Map): this {
        this.clearLayers();
        map.off('viewreset move', this.refresh, this)
        return this
    }

    refresh() {
        this.clearLayers();
        this.makelines()
    }

    makelines() {
        // let bounds = this.map.getBounds();
        let bounds = this.mapSvc.overlayLayer.getBounds()

        let lineFormat: PolylineOptions = {
            color: this.options.color,
            weight: this.options.lineWeight,
            interactive: false
        }

        // Border line
        polyline([bounds.getNorthEast(), bounds.getNorthWest(), bounds.getSouthWest(), bounds.getSouthEast(), bounds.getNorthEast()], lineFormat).addTo(this)

        let unit = DistanceUnit.getUnit(this.options.spacingUnit)
        let offsetEW = unit.toMeters((this.options.offsetEW || 0))
        let offsetNS = unit.toMeters((this.options.offsetNS || 0))
        let space = unit.toMeters(this.options.spacing)

        let distanceEW = bounds.getEast() - bounds.getWest()
        let distanceNS = bounds.getNorth() - bounds.getSouth()

        let startEW = bounds.getEast() + offsetEW
        let startNS = bounds.getSouth() + offsetNS

        let lineCountEW = Math.ceil(distanceNS / space) + 1
        let lineCountNS = Math.round(distanceEW / space) + 1

        console.log("EW ", offsetEW, space, distanceEW, startEW, lineCountEW);
        console.log("NS ", offsetNS, space, distanceNS, startNS, lineCountNS);

        for (let i = 0; i < lineCountEW; i++) {
            let lat = i * space + (offsetNS || 0)
            let p0 = latLng(lat, bounds.getEast())
            let p1 = latLng(lat, bounds.getWest())
            if (bounds.contains(p0)) {
                polyline([p0, p1], lineFormat).addTo(this)
            }
        }

        for (let i = 0; i < lineCountNS; i++) {
            let lng = i * space + (offsetEW || 0)
            let p0 = latLng(bounds.getNorth(), lng)
            let p1 = latLng(bounds.getSouth(), lng)
            if (bounds.contains(p0)) {
                polyline([p0, p1], lineFormat).addTo(this)
            }
        }
    }
}

export class GridOptions {
    enabled: boolean = false
    color: string = "#000"
    spacing: number = 5
    spacingUnit: string = 'ft'
    offsetNS: number = 0
    offsetEW: number = 0
    labels: boolean = true
    lineWeight: number = 1
}