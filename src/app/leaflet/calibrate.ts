import { LeafletMouseEvent, Point, Handler, Map as LeafletMap, layerGroup } from "leaflet";
import * as L from 'leaflet'
import { MapConfig } from "../models";
import { DialogService } from "../dialogs/dialog.service";
import { NgZone } from "@angular/core";
import { Trans, DistanceUnit } from "../util/transformation";
import { DataService } from "../data.service";
import { MapService } from "../map.service";
import { concatMap, take } from "rxjs/operators";


export class CalibrateX implements Handler {
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

    options: {
        position: 'topright',
        circleMarker: {
            color: 'red',
            radius: 2
        },
        lineStyle: {
            color: 'red',
            dashArray: '1,6'
        },
        lengthUnit: {
            display: 'km',
            decimal: 2,
            factor: null
        },
        angleUnit: {
            display: '&deg;',
            decimal: 2,
            factor: null
        }
    }

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
        this.map.off('click', this.onClick, this)
        this.map.off('mousemove', this.onMouseMove, this)
        L.DomEvent.off(this.map.getContainer(), 'keydown', this.escape, this)
    }

    onClick(e: LeafletMouseEvent) {
        if (this.active == false) {
            this.start = e.latlng
            this.startPx = e.layerPoint
            this.active = true
        } else {
            this.active = false
            this.disable()
            this.zone.run(() => {
                this.dialog.openDistance().subscribe(distance => {
                    // Old PPM
                    let oldPPM = this.mapCfg.ppm || 1
                    // Use the standard CRS because that has a 1:1 pixel transform
                    let simple = L.CRS.Simple
                    // Account for the current zoom level
                    let scale = simple.scale(this.map.getZoom())
                    // Only use the 'X' Dimension
                    let newPoint = L.point(e.layerPoint.x, this.startPx.y)
                    // Calculate the 'raw' distance (in screen coordinates)
                    let dist = this.startPx.distanceTo(newPoint)
                    // Scale the raw distance to account for zoom
                    let pixels = dist / scale
                    // Compute the PPM
                    let unit = DistanceUnit.getUnit(distance.unit)
                    let meters = unit.toMeters(distance.value)
                    let newPPM = Trans.computePPM(meters, pixels)
                    this.mapCfg.ppm = newPPM

                    // Save the Map
                    this.data.saveMap(this.mapCfg)

                    // Go through each marker on the map and fix the coordinates
                    this.data.getMarkers(this.mapCfg.id).pipe(take(1), concatMap(m => m)).subscribe(m => {
                        let loc = m.center()
                        let newLoc0 = loc[0] * oldPPM / newPPM
                        let newLoc1 = loc[1] * oldPPM / newPPM
                        m.setLocation([newLoc0, newLoc1])
                        this.data.save(m)
                    })

                    this.mapSvc.setConfig(this.mapCfg)
                })
            })
        }
    }

    onMouseMove(e: LeafletMouseEvent) {
        if (this.active) {
            this.end = L.latLng(this.start.lat, e.latlng.lng)
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
        }
    }

    escape(e: any) {
        if (e.keyCode === 27) {
            this.disable()
        }
    }
}