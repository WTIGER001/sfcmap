import { LeafletMouseEvent, Point, Handler, Map as LeafletMap, layerGroup } from "leaflet";
import * as L from 'leaflet'
import { MapConfig } from "../models";
import { DialogService } from "../dialogs/dialog.service";
import { NgZone } from "@angular/core";
import { Trans, DistanceUnit } from "../util/transformation";
import { DataService } from "../data.service";
import { MapService } from "../maps/map.service";
import { Format } from "../util/format";


export class Measure implements Handler {
    // The first point in the measure
    start: L.LatLng
    startPx: L.Point

    // the second point in the measure
    end: L.LatLng

    // The Layer Group with the annotations
    layer: L.LayerGroup

    disableFn: () => void

    _enabled = false
    active = false
    measureLine: L.Polyline

    constructor(private map: LeafletMap, private mapCfg: MapConfig, private dialog: DialogService, private zone: NgZone, private data: DataService, private mapSvc: MapService) {
        this.layer = layerGroup()
    }

    enable(): this {
        this._enabled = true
        this.start = undefined
        this.end = undefined

        this.addHooks()
        this.layer.addTo(this.map)
        return this
    }

    disable(): this {
        this.removeHooks()
        this.layer.clearLayers()
        this.layer.remove()
        this._enabled = false
        if (this.disableFn) {
            this.disableFn()
        }
        return this
    }

    enabled(): boolean {
        return this._enabled
    }

    onDisable(fn: () => void): any {
        this.disableFn = fn
    }

    addHooks?(): void {
        this.map.on('click', this.onClick, this)
        this.map.on('mousemove', this.onMouseMove, this)
        L.DomEvent.on(this.map.getContainer(), 'keydown', this.escape, this)
    }

    removeHooks?(): void {
        this.map.off('click', this.onClick)
        this.map.off('mousemove', this.onMouseMove)
        L.DomEvent.off(this.map.getContainer(), 'keydown', this.escape)
    }

    onClick(e: LeafletMouseEvent) {
        if (this.active == false) {
            this.start = e.latlng
            this.startPx = e.layerPoint
            this.active = true
        } else {
            this.active = false
            let distance = this.map.distance(this.start, this.end)
            let distFt = DistanceUnit.Feet.fromMeters(distance)
            let distPath = Math.floor(distFt / 5) * 5

            let text = distFt.toFixed(1) + '&nbsp;Feet <br>' + distPath.toFixed(1) + "&nbsp;Feet in Pathfinder";
            L.circleMarker(this.end, {
                color: 'red',
                radius: 0.1
            }).bindTooltip(text, { permanent: true, offset: L.point(0, -40), className: 'moving-tooltip' }).addTo(this.layer).openTooltip();

        }
    }

    onMouseMove(e: LeafletMouseEvent) {
        if (this.active) {
            this.end = e.latlng
            this.layer.clearLayers()
            this.measureLine = L.polyline([this.start, this.end], {
                color: 'red',
                dashArray: '1,6'
            })
            this.measureLine.addTo(this.layer)
            L.circle(this.start, {
                color: 'red',
                radius: 0.1
            }).addTo(this.layer)
            L.circle(this.end, {
                color: 'red',
                radius: 0.1
            }).addTo(this.layer)

            let distance = this.map.distance(this.start, this.end)
            let text = Format.formatDistance(distance)

            let distFt = DistanceUnit.Feet.fromMeters(distance)
            let distPath = Math.floor(distFt / 5) * 5
            if (distPath < 1000) {
                text = text + '<br>' + distPath.toFixed(1) + "&nbsp;Feet in Pathfinder";
            }
            L.circleMarker(this.end, {
                color: 'red',
                radius: 0.1
            }).bindTooltip(text, { permanent: true, offset: L.point(0, -40), className: 'moving-tooltip' }).addTo(this.layer).openTooltip();
        }
    }

    escape(e: any) {
        if (e.keyCode === 27) {
            this.disable()
        }
    }
}