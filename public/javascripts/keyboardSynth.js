define(['./keyboard.js', './interact.js'], function(keyboard, interact) {
  //keyboard key code, note identifier, frequency
  var public = {};

  var code = function(str) {
    return str.charCodeAt(0);
  };

  var keys = {
    z: ["A3"]
  , x: ["B3"]
  , c: ["C#4"]
  , v: ["E4"]
  , b: ["F#4"]
  , a: ["A4"]
  , s: ["B4"]
  , d: ["C#5"]
  , f: ["E5"]
  , g: ["F#5"]
  , q: ["A5"]
  , w: ["B5"]
  , e: ["C#6"]
  , r: ["E6"]
  , t: ["F#6"]
  , h: ["A4", "C#4", "E4"]
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
    echo("You can start making music");
  };

  return public;
});
