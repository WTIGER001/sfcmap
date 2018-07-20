import { Control, Map as LeafletMap, DomUtil, CRS, ControlPosition } from "leaflet";

export class ScaleOptions {
    position?: ControlPosition
    maxWidth?: number
    metric?: boolean
    imperial?: boolean
    updateWhenIdle?: boolean
    divisions?: number
    barHeight?: number
}

export class Scale extends Control {
    map: LeafletMap
    box: HTMLElement
    imperial: ScaleRuler
    metric: ScaleRuler

    options: ScaleOptions = {
        position: "bottomleft",
        maxWidth: 250,
        barHeight: 6,
        metric: false,
        imperial: true,
        updateWhenIdle: true,
        divisions: 4
    }

    onAdd(map: LeafletMap): HTMLElement {
        this.map = map

        this.box = DomUtil.create("div", "sfc-scale")
        // this.box.style.max = "100px"
        // this.box.style.width = "30px"
        // this.box.innerHTML = "THIS IS A SCALE"

        if (this.options.imperial) {
            this.imperial = new ScaleRuler(this, 'imperial')
        }
        if (this.options.metric) {
            this.metric = new ScaleRuler(this, 'metric')
        }

        map.on("moveend", this.update, this)
        map.whenReady(this.update, this)

        return this.box
    }
    onRemove(map: LeafletMap) {
        map.off("moveend", this.update, this)
    }

    update() {
        // this.box.innerHTML = "Zoom: " + this.map.getZoom()

        const y = this.map.getSize().y / 2;
        const maxMeters = this.map.distance(
            this.map.containerPointToLatLng([0, y]),
            this.map.containerPointToLatLng([this.options.maxWidth, y]));

        const realMax = maxMeters / this.options.divisions
        this.updateScales(realMax)
    }


    updateScales(maxMeters: number) {
        if (this.options.metric && maxMeters) {
            this.updateMetric(maxMeters);
        }
        if (this.options.imperial && maxMeters) {
            this.updateImperial(maxMeters);
        }
    }

    updateMetric(maxMeters: number) {
        var meters = this.getRoundNum(maxMeters),
            length = meters < 1000 ? meters : (meters / 1000),
            label = meters < 1000 ? ' m' : ' km';

        this.updateScale(this.metric, length, label, meters / maxMeters);
    }

    updateImperial(maxMeters: number) {
        var maxFeet = maxMeters * 3.2808399,
            maxMiles, miles, feet;

        if (maxFeet > 5280) {
            maxMiles = maxFeet / 5280;
            miles = this.getRoundNum(maxMiles);
            this.updateScale(this.imperial, miles, ' mi', miles / maxMiles);

        } else {
            feet = this.getRoundNum(maxFeet);
            this.updateScale(this.imperial, feet, ' ft', feet / maxFeet);
        }
    }

    updateScale(scale, text, unit, ratio) {
        // scale.style.width = Math.round(this.options.maxWidth * ratio) + 'px';
        // scale.innerHTML = text;

        let max = this.options.maxWidth / this.options.divisions
        scale.setBarWidth(max * ratio, text, unit)
    }

    getRoundNum(num: number) {
        var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
            d = num / pow10;

        d = d >= 10 ? 10 :
            d >= 7.5 ? 7.5 :
                d >= 5 ? 5 :
                    d >= 4 ? 4 :
                        d >= 3 ? 3 :
                            d >= 2 ? 2 : 1;

        return pow10 * d;
    }

}

class ScaleRuler {
    parent: HTMLElement
    bars: HTMLElement[] = []
    labels: HTMLElement[] = []
    constructor(private scale: Scale, private type: string) {
        console.log("Creating Scale Ruler ", type);

        this.parent = DomUtil.create('div', 'sfc-scale-ruler', scale.box)
        console.log("Created Scale Ruler DIV", this.parent);

        let divisions = scale.options.divisions
        for (let i = 0; i < divisions; i++) {
            let division = DomUtil.create('div', 'sfc-scale-division', this.parent)
            // division.style.height = "60px"

            let label = DomUtil.create('div', 'sfc-scale-bar-label', division)
            label.style.bottom = (this.scale.options.barHeight + 2) + "px"

            this.labels.push(label)

            let bar = DomUtil.create('div', this.getBarClass(i), division)
            bar.style.height = this.scale.options.barHeight + "px"
            this.bars.push(bar)
        }
    }

    setBarWidth(width: number, length: number, unit) {
        console.log("UPDATING BARS", width);
        this.bars.forEach(bar => {
            bar.style.width = width + "px"
        })
        this.labels.forEach((lbl, i) => {
            if (i < this.labels.length - 1) {
                lbl.innerText = (length * (i + 1)).toLocaleString()
            } else {
                lbl.innerText = (length * (i + 1)).toLocaleString() + unit
            }
        })
    }

    private getBarClass(i: number) {
        if (this.type == 'metric') {
            return i % 2 == 0 ? 'sfc-scale-bar-odd' : 'sfc-scale-bar-even'
        } else {
            return i % 2 == 1 ? 'sfc-scale-bar-odd' : 'sfc-scale-bar-even'
        }
    }
}