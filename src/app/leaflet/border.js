/**
 * 
 */
L.SimpleGraticule = L.LayerGroup.extend({
    initialize: function (options) {
        L.LayerGroup.prototype.initialize.call(this);
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {
        this._map = map;

        // Listen to events, etc
        this._map.on('viewreset', graticule, graticule);

    },

    onRemove: function (map) {
        // Unsubscribe from events
    },

    redraw: function () {

    },
})
