define(['./keyboard.js', './sound.js'], function(keyboard, sound) {
  //keyboard key code, note identifier, frequency
  var keys = {
    67: { name: "c5", freq: 440 }
  }

  var activate = function() {
    $('body').keydown(function(e) {
      var keyCode = e.which;
      if (keys[keyCode] !== undefined) {
        if (!keyboard.isPushed(keyCode)) {
          var name = keys[keyCode].name
            , freq = keys[keyCode].freq
            ;

          sound.playNote(name, freq);
          keyboard.push(keyCode);
        }
      }
    });

    $('body').keyup(function(e) {
      var keyCode = e.which;
      if (keys[keyCode] !== undefined) {
        if (keyboard.isPushed(keyCode)) {
          var name = keys[keyCode].name;

          sound.stopPlaying(name);
          keyboard.release(keyCode);
        }
      }
    });
  };

  return {
    activate: activate
  };
});
