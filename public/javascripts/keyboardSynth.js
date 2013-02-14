define(['./keyboard.js', './note.js'], function(keyboard, Note) {
  //keyboard key code, note identifier, frequency
  var public = {};

  var keys = {
    90: { name: "A3", freq: 220.000 }  //z
  , 88: { name: "B3", freq: 246.942 }  //x
  , 67: { name: "C#4", freq: 277.183 } //c
  , 86: { name: "E4", freq: 329.628 }  //v
  , 66: { name: "F#4", freq: 369.994 } //b
  , 65: { name: "A4", freq: 440.000 }  //a
  , 83: { name: "B4", freq: 493.883 }  //s
  , 68: { name: "C#5", freq: 554.365 } //d
  , 70: { name: "E5", freq: 659.255 }  //f
  , 71: { name: "F#5", freq: 739.989 } //g
  , 81: { name: "A5", freq: 880.000 }  //q
  , 87: { name: "B5", freq: 987.767 }  //w
  , 69: { name: "C#6", freq: 1108.73 } //e
  , 82: { name: "E6", freq: 1318.51 }  //r
  , 84: { name: "F#6", freq: 1479.98 } //t
  };

  var playing = {};

  public.activate = function() {
    $('body').keydown(function(e) {
      var keyCode = e.which;
      if (keys[keyCode] !== undefined) {
        if (!keyboard.isPushed(keyCode)) {
          var name = keys[keyCode].name
            , freq = keys[keyCode].freq
            , note = new Note(freq)
            ;


          note.play();
          playing[name] = note;
          keyboard.push(keyCode);
        }
      }
    });

    $('body').keyup(function(e) {
      var keyCode = e.which;
      if (keys[keyCode] !== undefined) {
        if (keyboard.isPushed(keyCode)) {
          var name = keys[keyCode].name;

          playing[name].stop();
          playing[name] = null;
          keyboard.release(keyCode);
        }
      }
    });
  };

  return public;
});
