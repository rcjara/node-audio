define(['./keyboard.js', './interact.js'], function(keyboard, interact) {
  //keyboard key code, note identifier, frequency
  var public = {};

  var code = function(str) {
    return str.charCodeAt(0);
  };

  var keys = {
    z: ["C3"]
  , x: ["D3"]
  , c: ["E3"]
  , v: ["G3"]
  , b: ["A3"]
  , a: ["C4"]
  , s: ["D4"]
  , d: ["E4"]
  , f: ["G4"]
  , g: ["A4"]
  , q: ["C5"]
  , w: ["D5"]
  , e: ["E5"]
  , r: ["G5"]
  , t: ["A5"]
  , h: ["C4", "E4", "G4"]
  };

  var playing = {};

  public.keydown = function(keyCode) {
    var key = String.fromCharCode(keyCode).toLowerCase();
    console.log('keydown: ' + key);
    if (keys[key] !== undefined) {
      if (!keyboard.isPushed(key)) {
        interact.emitSynthEvent("start", "piano", keys[key]);
        keyboard.push(key);
      }
    }
  };

  public.keyup = function(keyCode) {
    var key = String.fromCharCode(keyCode).toLowerCase();
    console.log('keyup: ' + key);
    if (keys[key] !== undefined) {
      if (keyboard.isPushed(key)) {
        interact.emitSynthEvent("stop", "piano", keys[key]);
        keyboard.release(key);
      }
    }
  };

  public.activate = function() {
    $('body').keydown(function(e) {
      public.keydown(e.which);
    });

    $('body').keyup(function(e) {
      public.keyup(e.which);
    });

    interact.emitSynthEvent("addInstrument", "piano");
    echo("You can start making music now.");
  };

  return public;
});
