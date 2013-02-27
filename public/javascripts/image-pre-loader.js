define([], function() {
  function Loader(imgs, callback) {
    this.numLoaded = 0;
    this.toLoad    = imgs.length;
    this.callback  = callback;

    var that = this;

    $.each(imgs, function(i, path) {
      var $img = $('<img/>', { src: path });
      $img.load(function() { that.loaded() });
    });
  }

  Loader.prototype.loaded = function() {
    this.numLoaded += 1;
    if (this.toLoad === this.numLoaded) {
      this.callback();
    }
  };

  return Loader;
});
