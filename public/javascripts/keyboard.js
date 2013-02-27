define(function() {
  var public = {}
    , keys = {}
    , WHITE_KEY_WIDTH = 39
    , BLACK_KEY_WIDTH = 28
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

  public.initialize = function() {
    var x = 0;
    var addOctave = function(octave) {
      for (var i = 0; i < keysOrder.length; i++) {
        var keyTemplate = keysTemplate[keysOrder[i]]
          , keyID = keysOrder[i] + octave
          , key = {}
          , newX = x
          , $elem
          ;

        key.type = keyTemplate.type;
        keys[keyID] = key;

        $elem = $('<img/>', { src: unpressedURL(key.type) });
        newX += advanceBy[key.type];

        key.elem = $elem;
        $elem.appendTo($('#keyboard'));
        $elem.css('top', 0 + 'px')
        $elem.css('left', (x + drawOffset[key.type]) + 'px');
        x = newX;
      }
    }

    for (var i = 3; i <= 5; i++) {
      addOctave(i);
    }
  };

  public.destroy = function() {
  };

  public.getKey = function(keyID) {
    return keys[keyID];
  };


  public.pressKey = function(keyID) {
    key = keys[keyID];
    key.elem.attr('src', pressedURL(key.type));
  };

  public.releaseKey = function(keyID) {
    key = keys[keyID];
    key.elem.attr('src', unpressedURL(key.type));
  };


  public.initialize();

  return public;
});

