import { Control, DomUtil, Util } from "leaflet";

export class ScaleOptions {
    position: "bottomleft"
    maxWidth: 200
    metric: true
    imperial: true
    updateWhenIdle: true
}

export class BetterScale extends Control {
    _map: any
    ScaleContainer
    _iScale
    _iScaleLabel
    _iScaleFirstNumber
    _iScaleSecondNumber

    options: {
        position: "bottomleft",
        maxWidth: 200,
        metric: true,
        imperial: true,
        updateWhenIdle: true
    }

    constructor(options?: ScaleOptions) {
        super()

        if (options) {
            Util.extend(this.options, options)
        }
    }

    onAdd(t) {
        console.log("ADDING-----------------------------");

        this._map = t;
        var e = "leaflet-control-better-scale",
            i = DomUtil.create("div", e),
            n = this.options,
            s = DomUtil.create("div", e + "-ruler", i);
        DomUtil.create("div", e + "-ruler-block " + e + "-upper-first-piece", s)
        DomUtil.create("div", e + "-ruler-block " + e + "-upper-second-piece", s)
        DomUtil.create("div", e + "-ruler-block " + e + "-lower-first-piece", s)
        DomUtil.create("div", e + "-ruler-block " + e + "-lower-second-piece", s);

        return this._addScales(n, e, i), this.ScaleContainer = i, t.on(n.updateWhenIdle ? "moveend" : "move", this._update, this), t.whenReady(this._update, this), i
    }

    onRemove(t) {
        t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this)
    }

    _addScales(t, e, i) {
        this._iScale = DomUtil.create("div", e + "-label-div", i)
        this._iScaleLabel = DomUtil.create("div", e + "-label", this._iScale)
        this._iScaleFirstNumber = DomUtil.create("div", e + "-label " + e + "-first-number", this._iScale)
        this._iScaleSecondNumber = DomUtil.create("div", e + "-label " + e + "-second-number", this._iScale)
    }

    _update() {
        var t = this._map.getBounds(),
            e = t.getCenter().lat,
            i = 6378137 * Math.PI * Math.cos(e * Math.PI / 180),
            n = i * (t.getNorthEast().lng - t.getSouthWest().lng) / 180,
            o = this._map.getSize(),
            s = this.options,
            a = 0;
        o.x > 0 && (a = n * (s.maxWidth / o.x)), this._updateScales(s, a)
    }

    _updateScales(t, e) {
        t.metric && e && this._updateMetric(e), t.imperial && e && this._updateImperial(e)
    }

    _updateMetric_old(t) {
        var e = this._getRoundNum(t);
        this._iScale.style.width = this._getScaleWidth(e / t) + "px", this._iScaleLabel.innerHTML = 1e3 > e ? e + " m" : e / 1e3 + " km"
    }

    _updateMetric(t) {
        var e, i, n, o, s, a = t,
            r = this._iScaleFirstNumber,
            h = this._iScaleSecondNumber,
            l = this._iScale,
            u = this._iScaleLabel;
        u.innerHTML = "0", a > 500 ? (e = a / 1000, i = this._getRoundNum(e), o = this._getRoundNum(e / 2), l.style.width = this._getScaleWidth(i / e) + "px", r.innerHTML = o, h.innerHTML = i + "km") : (n = this._getRoundNum(a), s = this._getRoundNum(a / 2), l.style.width = this._getScaleWidth(n / a) + "px", r.innerHTML = s, h.innerHTML = n + "m")
    }

    _updateImperial(t) {
        var e, i, n, o, s, a = 3.2808399 * t,
            r = this._iScaleFirstNumber,
            h = this._iScaleSecondNumber,
            l = this._iScale,
            u = this._iScaleLabel;
        u.innerHTML = "0", a > 2640 ? (e = a / 5280, i = this._getRoundNum(e), o = this._getRoundNum(e / 2), l.style.width = this._getScaleWidth(i / e) + "px", r.innerHTML = o, h.innerHTML = i + "mi") : (n = this._getRoundNum(a), s = this._getRoundNum(a / 2), l.style.width = this._getScaleWidth(n / a) + "px", r.innerHTML = s, h.innerHTML = n + "ft")
    }

    _getScaleWidth(t) {
        return Math.round(this.options.maxWidth * t) - 10
    }

    _getRoundNum(t): number {
        if (t >= 2) {
            var e = Math.pow(10, (Math.floor(t) + "").length - 1),
                i = t / e;
            return i = i >= 10 ? 10 : i >= 5 ? 5 : i >= 3 ? 3 : i >= 2 ? 2 : 1, e * i
        }
        return (Math.round(100 * t) / 100)
    }
}