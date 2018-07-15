import { Icon, icon } from "leaflet";
import { Debugger } from "../notify.service";
import { Map as LeafletMap, CRS } from 'leaflet'
import { MarkerType } from "./marker-type";
import { AnchorPostitionChoice } from "./annotations";

export class IconZoomLevelCache {
    minZoom = 0
    maxZoom = 20
    cache = new Map<string, Icon[]>()

    constructor(private log: Debugger, private loadinglog: Debugger) {

    }

    clear() {
        this.cache.clear()
    }

    load(types: MarkerType[], map: LeafletMap) {
        this.cache.clear()
        types.forEach(item => {
            this.addIcon(item, map)
        })
    }

    addIcon(type: MarkerType, map: LeafletMap) {
        let maxZoom = Math.min(this.maxZoom, 10)
        let minZoom = Math.max(this.minZoom, -5)

        let icons = []

        if (type.sizing == 'variable') {
            this.log.debug("Variable Sized Icon: ", type.name)

            for (let i = minZoom; i <= maxZoom; i++) {
                // Some of the icons have min or max zoom level where they cap out in size
                let zoomLevel = this.limit(i, type.zoomRange[0], type.zoomRange[1])
                let size = this.scale(map, zoomLevel, type.iconSize)
                let anchor = this.calcAnchor(size, type)

                if (type.name == 'Lich Agent') {
                    this.log.debug('Lich zoom: ', i, zoomLevel, size, anchor)
                }

                let icn = icon({
                    iconUrl: type.url,
                    iconSize: size,
                    iconAnchor: anchor
                })

                icons.push(icn)
            }
        } else {
            this.log.debug("Fixed Sized Icon: ", type.name)

            let anchor = this.calcAnchor(type.iconSize, type)
            let icn = icon({
                iconUrl: type.url,
                iconSize: type.iconSize,
                iconAnchor: anchor
            })
            for (let i = minZoom; i <= maxZoom; i++) {
                icons.push(icn)
            }
        }
        this.cache.set(type.id, icons)
    }

    limit(value: number, min: number, max: number) {
        return Math.min(max, Math.max(min, value))
    }

    /**
     * Calculate how large or small the marker should be at the given zoom level
     * @param map The Map that will be projected 
     * @param zoom The zoom level to use
     * @param size The original size of the marker (in pixels) for the map at native resolution
     */
    scale(map: LeafletMap, zoom: number, size: [number, number]): [number, number] {
        let simple = CRS.Simple
        let scale = simple.scale(zoom)
        return [size[0] * scale, size[1] * scale]
    }

    calcAnchor(size: [number, number], type: MarkerType, ): [number, number] {

        let [sx, sy] = [1, 1]
        if (type.anchorPosition == AnchorPostitionChoice.BottomLeft) {
            sx = 0
            sy = size[1]
        } else if (type.anchorPosition == AnchorPostitionChoice.BottomCenter) {
            sx = 0.5 * size[0]
            sy = size[1]
        } else if (type.anchorPosition == AnchorPostitionChoice.BottomRight) {
            sx = size[0]
            sy = size[1]
        } else if (type.anchorPosition == AnchorPostitionChoice.MiddleLeft) {
            sx = 0
            sy = 0.5 * size[1]
        } else if (type.anchorPosition == AnchorPostitionChoice.MiddleCenter) {
            sx = 0.5 * size[0]
            sy = 0.5 * size[1]
        } else if (type.anchorPosition == AnchorPostitionChoice.MiddleRight) {
            sx = size[0]
            sy = 0.5 * size[1]
        } else if (type.anchorPosition == AnchorPostitionChoice.TopLeft) {
            sx = 0
            sy = 0
        } else if (type.anchorPosition == AnchorPostitionChoice.TopCenter) {
            sx = 0.5 * size[0]
            sy = 0
        } else if (type.anchorPosition == AnchorPostitionChoice.TopRight) {
            sx = size[0]
            sy = 0
        }

        return [sx, sy]
    }

    getIcon(id: string, zoomLevel: number): Icon {
        let index = zoomLevel - this.minZoom
        let icons = this.cache.get(id)
        if (icons) {
            return icons[index]
        }
        return undefined
    }

    getAnyIcon(id: string): Icon {
        let icons = this.cache.get(id)
        if (icons) {
            return icons[0]
        }
        return undefined
    }
}