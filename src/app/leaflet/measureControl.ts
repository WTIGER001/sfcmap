import { Control, Map, DomUtil } from "leaflet";

export class MeasureControl extends Control {
    _container: HTMLElement
    constructor() {
        super()
        this.options.position = 'topleft'
    }

    onAdd(map: Map): HTMLElement {
        this._container = DomUtil.create('div', 'leaflet-bar');
        this._container.classList.add('leaflet-ruler');

        return this._container
    }

    onRemove(map: Map) {

    }
}