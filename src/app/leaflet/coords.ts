import { Control, Map as LeafletMap, DomEvent, DomUtil } from "leaflet";
import * as L from 'leaflet'

export class CoordsControl extends Control {
    onMap: boolean
    _map: LeafletMap
    _container: HTMLElement
    _labelcontainer: HTMLElement
    _label: HTMLElement
    _showsCoordinates: boolean
    _currentPos: any
    opts: any
    static options: {
        position: 'bottomright',
        //decimals used if not using DMS or labelFormatter functions
        decimals: 4,
        //decimalseperator used if not using DMS or labelFormatter functions
        decimalSeperator: ".",
        //label templates for usage if no labelFormatter function is defined
        labelTemplateLat: "Lat: {y}",
        labelTemplateLng: "Lng: {x}",
        //label formatter functions
        labelFormatterLat: undefined,
        labelFormatterLng: undefined,
        //switch on/off input fields on click
        enableUserInput: true,
        //use Degree-Minute-Second
        useDMS: false,
        //if true lat-lng instead of lng-lat label ordering is used
        useLatLngOrder: false,
        //if true user given coordinates are centered directly
        centerUserCoordinates: false,
    }

    constructor(opts?: any) {
        let options = {}
        Object.assign(options, CoordsControl.options)
        Object.assign(options, opts)
        super(options)
        this.opts = options
    }

    show(map: LeafletMap, showMe: boolean): any {
        if (showMe && !this.onMap) {
            this.addTo(map)
        } else if (!showMe && this.onMap) {
            this.remove()
        }
    }

    onAdd(map: LeafletMap): HTMLElement {
        this._map = map;

        var className = 'leaflet-control-coordinates',
            container = this._container = DomUtil.create('div', className),
            options = this.options;

        //label containers
        this._labelcontainer = DomUtil.create("div", "uiElement label", container);
        this._label = DomUtil.create("span", "labelFirst", this._labelcontainer);

        //connect to mouseevents
        map.on("mousemove", this._update, this);

        map.whenReady(this._update, this);

        this._showsCoordinates = true;
        this.onMap = true
        return container;
    }

    /**
	 *	Returns a Number according to options (DMS or decimal)
	 */
    _getNumber(n, opts) {
        var res;
        // if (opts.useDMS) {
        //     res = L.NumberFormatter.toDMS(n);
        // } else {
        //     res = L.NumberFormatter.round(n, opts.decimals, opts.decimalSeperator);
        // }
        res = Math.round(n)
        return res;
    }

    _createCoordinateLabel(ll: any) {
        let opts = this.opts,
            x, y;
        if (opts.customLabelFcn) {
            return opts.customLabelFcn(ll, opts);
        }
        if (opts.labelLng) {
            x = opts.labelFormatterLng(ll.lng);
        } else {
            x = L.Util.template(opts.labelTemplateLng, {
                x: this._getNumber(ll.lng, opts)
            });
        }
        if (opts.labelFormatterLat) {
            y = opts.labelFormatterLat(ll.lat);
        } else {
            y = L.Util.template(opts.labelTemplateLat, {
                y: this._getNumber(ll.lat, opts)
            });
        }
        if (opts.useLatLngOrder) {
            return y + " " + x;
        }
        return x + " " + y;
    }



    onRemove(map: LeafletMap) {
        map.off("mousemove", this._update, this);
        this.onMap = false
    }

    /**
     *	Mousemove callback function updating labels and input elements
     */
    _update() {
        let evt = arguments[0]
        var pos = evt.latlng,
            opts = this.options;
        if (pos) {
            // pos = pos.wrap();
            this._currentPos = pos;
            this._label.innerHTML = this._createCoordinateLabel(pos);
        }
    }


}