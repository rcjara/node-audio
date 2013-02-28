define(['/javascripts/image-pre-loader.js'], function(Loader) {
  var public = {}
    , keys = {}
    , WHITE_KEY_WIDTH = 39
    , BLACK_KEY_WIDTH = 28
    , doneLoading = false
    ;

  var keysOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  var keysTemplate = {
    'C':  { type: "white-right" }
  , 'C#': { type: "black" }
  , 'D':  { type: "white-both" }
  , 'D#': { type: "black" }
  , 'E':  { type: "white-left" }
  , 'F':  { type: "white-right" }
  , 'F#': { type: "black" }
  , 'G':  { type: "white-both" }
  , 'G#': { type: "black" }
  , 'A':  { type: "white-both" }
  , 'A#': { type: "black" }
  , 'B':  { type: "white-left" }
  };

  var advanceBy = {
    'white-right': WHITE_KEY_WIDTH
  , 'white-left':  WHITE_KEY_WIDTH
  , 'white-both':  WHITE_KEY_WIDTH
  , 'black':       0
  };

  var drawOffset = {
    'white-right': 0
  , 'white-left':  0
  , 'white-both':  0
  , 'black':       -0.5 * BLACK_KEY_WIDTH
  };



  var pressedURL = function(type) {
    return '/images/pressed-keys/' + type + '.png';
  };

  var unpressedURL = function(type) {
    return '/images/keys/' + type + '.png';
  };

  var initialize = function() {
    var x = 0;

    var addOctave = function(octave) {
      for (var i = 0; i < keysOrder.length; i++) {
        var keyTemplate = keysTemplate[keysOrder[i]]
          , keyID = keysOrder[i] + octave
          , key = {}
          , newX = x
          ;

        key.type = keyTemplate.type;
        keys[keyID] = key;

        var $elem = $('<img/>', { src: unpressedURL(key.type) });
        newX += advanceBy[key.type];

        key.elem = $elem;
        $elem.appendTo($('#keyboard'));
        $elem.css('top', 0 + 'px')
        $elem.css('left', (x + drawOffset[key.type]) + 'px');
        x = newX;
      }
    }

    var keyboardWidth = parseInt( $('#keyboard').css('width') )
      , keyboardCentering = ($(document).width() - keyboardWidth) / 2
      ;
    $('#keyboard').css('left', keyboardCentering + 'px');

    for (var i = 3; i <= 5; i++) {
      addOctave(i);
    }
    doneLoading = true;
  };

  public.initialize = function() {
    var urls = [ '/images/keys/white-left.png'
               , '/images/keys/white-right.png'
               , '/images/keys/white-both.png'
               , '/images/keys/black.png'
               , '/images/pressed-keys/white-left.png'
               , '/images/pressed-keys/white-right.png'
               , '/images/pressed-keys/white-both.png'
               , '/images/pressed-keys/black.png'
               ];
    new Loader(urls, initialize);
  };


  public.destroy = function() {
    $.each(keys, function(keyID, key) {
      key.elem.remove();
      if (typeof key.label !== 'undefined') {
        key.label.remove();
      }
    });
    keys = {};
    doneLoading = false;
  };

  public.getKey = function(keyID) {
    return keys[keyID];
  };

  public.addLabel = function(label, keyID) {
    //if not done loading, retry shortly
    if (!doneLoading) {
      setTimeout(function() { public.addLabel(label, keyID); }, 100);
      return;
    }

    var key = keys[keyID];
    //return early if a key is called that's out of range of the keyboard
    if (typeof key === 'undefined') {
      return;
    }

    if (typeof key.label !== 'undefined') {
      key.label.remove();
    }

    var baseX = key.elem.position().left
      , baseY = key.elem.position().top
      , width = key.elem.width()
      , height = key.elem.height()
      ;

    var $label = $('<p>' + label + '</p>');

    var heightRatio;
    if (key.type === 'black') {
      heightRatio = 5.0 / 8;
    } else {
      heightRatio = 3.0 / 4;
    }

    var radius = (width * 3 / 4);
    $label.css('width',         radius + 'px');
    $label.css('height',        radius + 'px');
    $label.css('line-height',   radius + 'px');
    $label.css('border-radius', (radius / 2) + 'px');
    $label.css('top',           (baseY + (height * heightRatio)) + 'px');
    $label.css('left',          (baseX + ((width - radius) / 2)) + 'px');

    $('#keyboard').append($label);

    key.label = $label;
  };


  public.pressKey = function(keyID) {
    key = keys[keyID];
    key.elem.attr('src', pressedURL(key.type));
  };

  public.releaseKey = function(keyID) {
    key = keys[keyID];
    key.elem.attr('src', unpressedURL(key.type));
  };


  return public;
});
