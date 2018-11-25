// import {Layer} from './Layer';
// import * as Util from '../core/Util';
// import {toLatLngBounds} from '../geo/LatLngBounds';
// import {Bounds} from '../geometry/Bounds';
// import * as DomUtil from '../dom/DomUtil';
import { DomUtil, Util, Layer, toLatLngBounds, Bounds} from "leaflet";


/*
 * @class ElemOverlay
 * @aka L.ElemOverlay
 * @inherits Interactive layer
 *
 * Used to load and display a single image over specific bounds of the map. Extends `Layer`.
 *
 * @example
 *
 * ```js
 * var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
 * 	imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
 * L.ElemOverlay(imageUrl, imageBounds).addTo(map);
 * ```
 */

L.ElemOverlay = Layer.extend({

	// @section
	// @aka ElemOverlay options
	options: {
		// @option opacity: Number = 1.0
		// The opacity of the image overlay.
		opacity: 1,

		// @option alt: String = ''
		// Text for the `alt` attribute of the image (useful for accessibility).
		alt: '',

		// @option interactive: Boolean = false
		// If `true`, the image overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
		interactive: true,

		// @option crossOrigin: Boolean = false
		// If true, the image will have its crossOrigin attribute set to ''. This is needed if you want to access image pixel data.
		crossOrigin: false,

		// @option errorOverlayUrl: String = ''
		// URL to the overlay image to show in place of the overlay that failed to load.
		errorOverlayUrl: '',

		// @option zIndex: Number = 1
		// The explicit [zIndex](https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index) of the tile layer.
		zIndex: 1,

		// @option className: String = ''
		// A custom class name to assign to the image. Empty by default.
    className: '',
    
    existing: undefined, // Existing div / eelement
	},

	initialize: function (type, bounds, options) { // (String, LatLngBounds, Object)
    this._type = type;
    this._bounds = this.toLatLngBounds(bounds);

		Util.setOptions(this, options);
  },
  
  getElement: function() {
    return this._elem
  },

	onAdd: function () {
		if (!this._elem) {
			this._initImage();

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}
		}

		if (this.options.interactive) {
			DomUtil.addClass(this._elem, 'leaflet-interactive');
			this.addInteractiveTarget(this._elem);
		}

		this.getPane().appendChild(this._elem);
		this._reset();
	},

	onRemove: function () {
		DomUtil.remove(this._elem);
		if (this.options.interactive) {
			this.removeInteractiveTarget(this._elem);
		}
	},

	// @method setOpacity(opacity: Number): this
	// Sets the opacity of the overlay.
	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._elem) {
			this._updateOpacity();
		}
		return this;
	},

	setStyle: function (styleOpts) {
		if (styleOpts.opacity) {
			this.setOpacity(styleOpts.opacity);
		}
		return this;
	},

	// @method bringToFront(): this
	// Brings the layer to the top of all overlays.
	bringToFront: function () {
		if (this._map) {
			DomUtil.toFront(this._elem);
		}
		return this;
	},

	// @method bringToBack(): this
	// Brings the layer to the bottom of all overlays.
	bringToBack: function () {
		if (this._map) {
			DomUtil.toBack(this._elem);
		}
		return this;
	},

	// @method setBounds(bounds: LatLngBounds): this
	// Update the bounds that this ElemOverlay covers
	setBounds: function (bounds) {
		this._bounds = this.toLatLngBounds(bounds);

		if (this._map) {
			this._reset();
		}
		return this;
	},

	getEvents: function () {
		var events = {
			zoom: this._reset,
			viewreset: this._reset
		};

		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}

		return events;
	},

	// @method: setZIndex(value: Number) : this
	// Changes the [zIndex](#ElemOverlay-zindex) of the image overlay.
	setZIndex: function (value) {
		this.options.zIndex = value;
		this._updateZIndex();
		return this;
	},

	// @method getBounds(): LatLngBounds
	// Get the bounds that this ElemOverlay covers
	getBounds: function () {
		return this._bounds;
	},

	// @method getElement(): HTMLElement
	// Returns the instance of [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
	// used by this overlay.
	getElement: function () {
		return this._elem;
	},

	_initImage: function () {
    var elem
    if (this.options.existing) {
      // console.log("Using Previous DIV ", this._type)
      elem = this.options.existing
    } else {
      // console.log("Creating DIV ", this._type)
      var elem = DomUtil.create(this._type || 'div')
    }
    

		DomUtil.addClass(elem, 'leaflet-image-layer');
		// DomUtil.addClass(elem, 'debug-black');
		if (this._zoomAnimated) { DomUtil.addClass(elem, 'leaflet-zoom-animated'); }
		if (this.options.className) { DomUtil.addClass(elem, this.options.className); }

		elem.onselectstart = Util.falseFn;
		elem.onmousemove = Util.falseFn;

		// // @event load: Event
		// // Fired when the ElemOverlay layer has loaded its image
		// elem.onload = Util.bind(this.fire, this, 'load');
		// elem.onerror = Util.bind(this._overlayOnError, this, 'error');

		if (this.options.crossOrigin) {
			elem.crossOrigin = '';
		}

		if (this.options.zIndex) {
			this._updateZIndex();
		}

		elem.src = this._type;
    elem.alt = this.options.alt;
    this._elem = elem
	},

	_animateZoom: function (e) {
		var scale = this._map.getZoomScale(e.zoom),
		    offset = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;

		DomUtil.setTransform(this._elem, offset, scale);
  },
  
  toLatLngBounds: function (a, b) {
    if (a instanceof L.LatLngBounds) {
      return a;
    }
    return new L.LatLngBounds(a, b);
  },

	_reset: function () {
		var image = this._elem,
		    bounds = new Bounds(
		        this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		        this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
		    size = bounds.getSize();

		DomUtil.setPosition(image, bounds.min);

		image.style.width  = size.x + 'px';
		image.style.height = size.y + 'px';
	},

	_updateOpacity: function () {
		DomUtil.setOpacity(this._elem, this.options.opacity);
	},

	_updateZIndex: function () {
		if (this._elem && this.options.zIndex !== undefined && this.options.zIndex !== null) {
			this._elem.style.zIndex = this.options.zIndex;
		}
	},

	_overlayOnError: function () {
		// @event error: Event
		// Fired when the ElemOverlay layer has loaded its image
		this.fire('error');

		var errorUrl = this.options.errorOverlayUrl;
		if (errorUrl && this._type !== errorUrl) {
			this._type = errorUrl;
			this._elem.src = errorUrl;
		}
	}
});

// @factory L.ElemOverlay(imageUrl: String, bounds: LatLngBounds, options?: ElemOverlay options)
// Instantiates an image overlay object given the URL of the image and the
// geographical bounds it is tied to.
L.elemOverlay = function (type, bounds, options) {
  return new L.ElemOverlay(type, bounds, options);
};



'use strict';

/* A Draggable that does not update the element position
and takes care of only bubbling to targetted path in Canvas mode. */
L.ElemDraggable = L.Draggable.extend({

  initialize: function (path) {
    this._path = path;
    this._canvas = (path._map.getRenderer(path) instanceof L.Canvas);
    var element = this._canvas ? this._path._map.getRenderer(this._path)._container : this._path._elem;
    L.Draggable.prototype.initialize.call(this, element, element, true);
  },

  _updatePosition: function () {
    var e = { originalEvent: this._lastEvent };
    this.fire('drag', e);
  },

  _onDown: function (e) {
    var first = e.touches ? e.touches[0] : e;
    this._startPoint = new L.Point(first.clientX, first.clientY);
    if (this._canvas && !this._path._containsPoint(this._path._map.mouseEventToLayerPoint(first))) { return; }
    L.Draggable.prototype._onDown.call(this, e);
  }

});


L.Handler.ElemDrag = L.Handler.extend({

  initialize: function (image) {
    this._path = image;
  },

  getEvents: function () {
    return {
      dragstart: this._onDragStart,
      drag: this._onDrag,
      dragend: this._onDragEnd
    };
  },

  addHooks: function () {
    if (!this._draggable) {
      this._draggable = new L.ElemDraggable(this._path);
    }
    var a = this._draggable.on(this.getEvents(), this)
    a.enable();
    L.DomUtil.addClass(this._draggable._element, 'leaflet-path-draggable');
  },

  removeHooks: function () {
    this._draggable.off(this.getEvents(), this).disable();
    L.DomUtil.removeClass(this._draggable._element, 'leaflet-path-draggable');
  },

  moved: function () {
    return this._draggable && this._draggable._moved;
  },

  _onDragStart: function () {
    this._startPoint = this._draggable._startPoint;
    this._path
      .closePopup()
      .fire('movestart')
      .fire('dragstart');
  },

  _onDrag: function (e) {
    var path = this._path,
      event = (e.originalEvent.touches && e.originalEvent.touches.length === 1 ? e.originalEvent.touches[0] : e.originalEvent),
      newPoint = L.point(event.clientX, event.clientY),
      latlng = path._map.layerPointToLatLng(newPoint);

    this._offset = newPoint.subtract(this._startPoint);
    this._startPoint = newPoint;

    this._path.eachLatLng(this.updateLatLng, this);
    path.updateBoundsFromLatLngs();

    e.latlng = latlng;
    e.offset = this._offset;
    path.fire('drag', e);
    e.latlng = this._path.getCenter ? this._path.getCenter() : this._path.getBounds().getCenter();
    path.fire('move', e);
  },

  _onDragEnd: function (e) {
    if (this._path._bounds) this.resetBounds();
    this._path.fire('moveend')
      .fire('dragend', e);
  },

  latLngToLayerPoint: function (latlng) {
    // Same as map.latLngToLayerPoint, but without the round().
    var projectedPoint = this._path._map.project(L.latLng(latlng));
    return projectedPoint._subtract(this._path._map.getPixelOrigin());
  },

  updateLatLng: function (latlng) {
    var oldPoint = this.latLngToLayerPoint(latlng);
    oldPoint._add(this._offset);
    var newLatLng = this._path._map.layerPointToLatLng(oldPoint);
    latlng.lat = newLatLng.lat;
    latlng.lng = newLatLng.lng;
  },

  resetBounds: function () {
    this._path._bounds = new L.LatLngBounds();
    this._path.eachLatLng(function (latlng) {
      this._bounds.extend(latlng);
    });
  }

});


L.ElemOverlay.addInitHook(function () {
  this.dragging = new L.Handler.ElemDrag(this);
  if (this.options.draggable) {
    this.once('add', function () {
      this.dragging.enable();
    });
  }

});

L.ElemOverlay.include({

  eachLatLng: function (callback, context) {
    context = context || this;
    var loop = function (latlngs) {
      for (var i = 0; i < latlngs.length; i++) {
        if (L.Util.isArray(latlngs[i])) loop(latlngs[i]);
        else callback.call(context, latlngs[i]);
      }
    };
    loop(this.getLatLngs ? this.getLatLngs() : [this.getLatLng()]);
  }

});