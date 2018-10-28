TokenImageOverlay = L.ImageOverlay.extend({

  options: { rotation: 0 },
  _animateZoom: function (e) {
    L.ImageOverlay.prototype._animateZoom.call(this, e);
    var img = this._image;
    img.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.rotation + 'deg)';
  },
  _reset: function () {
    L.ImageOverlay.prototype._reset.call(this);
    var img = this._image;
    img.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.rotation + 'deg)';
  },

  /// 
  drawAuras: function() {

  }


});