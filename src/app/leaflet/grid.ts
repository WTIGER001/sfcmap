import { LayerGroup, Map, polyline, latLng, PolylineOptions, LatLngExpression, LatLng, LatLngBounds, latLngBounds, LeafletMouseEvent, Rectangle, rectangle, DomEvent } from "leaflet";
import { DistanceUnit, Trans } from "../util/transformation";
import { MapService } from "../maps/map.service";
import { Rect } from "../util/geom";

export class GridLayer extends LayerGroup {

  options = new GridOptions()
  map: Map
  cellRect: Rectangle
  highlighting: boolean

  constructor(private mapSvc: MapService) {
    super()
  }


  /**
   * Creates a new bounds with the object
   * @param bounds Bounds to snap
   */
  snapBounds(bounds: LatLngBounds, center: LatLng): LatLngBounds {
    let unit = DistanceUnit.getUnit(this.options.spacingUnit)
    let space = unit.toMeters(this.options.spacing)

    let dLat = bounds.getNorth() - bounds.getSouth()
    let dLng = bounds.getEast() - bounds.getWest()

    let nLat = dLat / space
    let nLng = dLng / space

    nLat = Math.round(nLat)
    nLng = Math.round(nLng)

    // Use the mouse to get the grid cell... If the nlat is odd then use the center if even then use the bottom
    let cell = this.getGridCell(center)
    let newLat, newLng
    if (nLat % 2 == 1) {
      newLat = cell.getCenter().lat
    } else {
      newLat = cell.getSouth()
    }
    if (nLng % 2 == 1) {
      newLng = cell.getCenter().lng
    } else {
      newLng = cell.getEast()
    }

    return Rect.centerOn(bounds, latLng(newLat, newLng))
  }

  getMapBounds() {
    if (this.mapSvc && this.mapSvc.overlayLayer) {
      return this.mapSvc.overlayLayer.getBounds();
    } else {
      const m = this.mapSvc._mapCfg
      let factor = Trans.computeFactor(m)
      return  latLngBounds([[0, 0], [m.height / factor, m.width / factor]]);
    }
  }

  /**
   * Gets the nearest vertex to the selected point. 
   * @param ll Point to search for
   */
  getGridVertex(ll: LatLng): LatLng {
    const bounds = this.getMapBounds()

    let unit = DistanceUnit.getUnit(this.options.spacingUnit)
    let offsetEW = unit.toMeters((this.options.offsetEW || 0))
    let offsetNS = unit.toMeters((this.options.offsetNS || 0))
    let space = unit.toMeters(this.options.spacing)

    let startCol = ll.lng - offsetEW
    let col = Math.floor(startCol / space)
    let startRow = ll.lat - offsetNS
    let row = Math.floor(startRow / space)

    let west = (col * space) + offsetEW
    let east = west + space
    let south = (row * space) + offsetNS
    let north = south + space

    // 
    // let all = [ latLng(north, east), latLng(north, west), latLng(south, east), latLng([south, west) ]

    let lat = Math.abs(ll.lat - north) > Math.abs(ll.lat - south) ? south : north
    let lng = Math.abs(ll.lng - east) > Math.abs(ll.lng - west) ? west : east

    return latLng(lat, lng)
  }


  /**
   * Find the cell that this point includes
   * @param ll Point to search for
   */
  getGridCell(ll: LatLng): LatLngBounds {
    const bounds = this.getMapBounds()

    let unit = DistanceUnit.getUnit(this.options.spacingUnit)
    let offsetEW = unit.toMeters((this.options.offsetEW || 0))
    let offsetNS = unit.toMeters((this.options.offsetNS || 0))
    let space = unit.toMeters(this.options.spacing)

    let startCol = ll.lng - offsetEW
    let col = Math.floor(startCol / space)
    let startRow = ll.lat - offsetNS
    let row = Math.floor(startRow / space)

    let west = (col * space) + offsetEW
    let east = west + space
    let south = (row * space) + offsetNS
    let north = south + space

    let bnds = latLngBounds([south, west], [north, east])
    return bnds
  }

  highlightCell(event: LeafletMouseEvent) {
    if (this.highlighting) {
      let cell = this.getGridCell(event.latlng)
      if (!this.cellRect) {
        this.cellRect = rectangle(cell, { color: 'red' }).addTo(this._map)
      } else {
        this.cellRect.setBounds(cell)
      }
    }
  }

  onAdd(map: Map): this {
    this.map = map
    map.on('viewreset move', this.refresh, this)
    map.on('mousemove', this.highlightCell, this)
    this.refresh()
    return this
  }

  onRemove(map: Map): this {
    this.clearLayers();
    map.off('viewreset move', this.refresh, this)
    map.off('mousemove', this.highlightCell, this)
    return this
  }

  refresh() {
    this.clearLayers();
    this.makelines()
  }

  makelines() {
    const bounds = this.getMapBounds()

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