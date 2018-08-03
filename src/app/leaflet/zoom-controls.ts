import { Control, Map as LeafletMap, DomUtil, DomEvent, ControlOptions } from "leaflet";
import { MapService } from "../map.service";

export class ZoomControls extends Control {
  map: LeafletMap
  box: HTMLElement
  btnZoomIn: HTMLElement
  btnZoomOut: HTMLElement
  btnZoomExtents: HTMLElement

  constructor(private mapSvc: MapService, options?: ControlOptions) {
    super(options)
  }

  onAdd(map: LeafletMap): HTMLElement {
    this.map = map
    this.box = DomUtil.create("div", "sfc-map-zoombar btn-group-vertical")
    // this.box.style.max = "100px"
    // this.box.style.width = "30px"
    // this.box.innerHTML = "THIS IS A SCALE"
    this.btnZoomIn = this.makeBtn('plus', this.zoomIn)
    this.btnZoomIn = this.makeBtn('minus', this.zoomOut)
    this.btnZoomIn = this.makeBtn('expand', this.zoomExtents)

    return this.box
  }
  onRemove(map: LeafletMap) {
    // map.off("moveend", this.update, this)
  }

  zoomIn() {
    let currentZoom = this.map.getZoom()
    if (this.map.getMaxZoom() > currentZoom) {
      this.map.setZoom(++currentZoom)
    }
  }

  zoomOut() {
    let currentZoom = this.map.getZoom()
    if (this.map.getMinZoom() < currentZoom) {
      this.map.setZoom(--currentZoom)
    }
  }

  zoomExtents() {
    let bounds = this.mapSvc.overlayLayer.getBounds()
    this.map.fitBounds(bounds)
    // this.map.flyToBounds(bounds)
  }

  private makeBtn(icon: string, fn: () => void): HTMLElement {
    let btn = DomUtil.create("button", "sfc-map-zoombar-item btn", this.box)
    // btn.innerText = "X"

    DomUtil.create('i', "fas fa-" + icon, btn)
    // DomEvent.on(btn, 'click', fn, this)
    DomEvent.disableClickPropagation(btn);
    DomEvent.on(btn, 'click', DomEvent.stop);
    DomEvent.on(btn, 'click', fn, this);
    DomEvent.on(btn, 'click', this['_refocusOnMap'], this);
    return btn
  }
}