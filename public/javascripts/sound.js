//Create a toplevel audio context
var audioCtx;
if (typeof AudioContext !== "undefined") {
    audioCtx = new AudioContext();
    console.log("Using AudioContext");
} else if (typeof webkitAudioContext !== "undefined") {
    audioCtx = new webkitAudioContext();
    console.log("Using webkitAudioContext");
} else {
    throw new Error('AudioContext not supported. :(');
}

var sound = (function() {
  var sources        = {},
      volumes        = {},
      sounds_loaded  = 0,
      sounds_to_load = 0,
      done_loading   = function() {};

  var echo_test = function() {
    echo('Echo test');
    if (audioCtx !== undefined) {
      echo('Audio context exists');
    }
  };

  var multi_sound_test = function() {
    echo('starting multi_sound_test');

    load_sound('beep', 'audio/beep-1.mp3');
    load_sound('hello', 'http://thelab.thingsinjars.com/web-audio-tutorial/hello.mp3');

    done_loading = function() {
      play('hello');
      play('beep', 0.6);

      var currTime = audioCtx.currentTime;
      volumes['hello'].gain.linearRampToValueAtTime(0, currTime);
      volumes['hello'].gain.linearRampToValueAtTime(1, currTime + 10.1);
    };
  };

  var play = function(ident, volume) {
    if (volume !== undefined) {
      volumes[ident].gain = volume;
    }
    sources[ident].noteOn(audioCtx.currentTime);
  }

  var load_sound = function(ident, url) {
    echo('starting load_sound');
    sounds_to_load++;
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      var audioData = request.response,
          source    = audioCtx.createBufferSource();
          buffer    = audioCtx.createBuffer(audioData, true/*make mono*/);
      source.buffer = buffer;
      sources[ident] = source;

      volumeNode = audioCtx.createGainNode();
      volumeNode.gain.value = 0.1;
      volumes[ident] = volumeNode;

      source.connect(volumeNode);
      volumeNode.connect(audioCtx.destination);
      sounds_loaded++;

      echo('ident: ' + ident + 'sounds_loaded: ' + sounds_loaded);
      if (sounds_loaded >= sounds_to_load) {
        done_loading();
      }
    };

    request.send();
  };

  var make_oscillator = function(ident) {
    var source = audioCtx.createOscillator();
    source.frequency.value = 400;


  }

  var sound_test = function() {
    console.log('starting sound test');
    var request = new XMLHttpRequest();
    request.open("GET", 'audio/beep-1.mp3', true);
    request.responseType = "arraybuffer";

    // Our asynchronous callback
    request.onload = function() {
        echo('loaded');
        var audioData = request.response,
            soundSource = audioCtx.createBufferSource();
            soundBuffer = audioCtx.createBuffer(audioData, true/*make mono*/);

        soundSource.buffer = soundBuffer;
        soundSource.connect(audioCtx.destination);
        soundSource.noteOn(audioCtx.currentTime);
    };

    request.send();

  };

  var start_key_test = function() {
    load_sound('c', 'audio/piano_middle_C.mp3');
    done_loading = function() {
      sources['c'].loop = true;
    }
    $('body').keydown(function(e) {
      console.log('keydown');
      if (e.which === 70) {
        sources['c'].noteOn(0);
      }
    });
  };

  return {
    echo_test: echo_test,
    sound_test: sound_test,
    multi_sound_test: multi_sound_test,
    start_key_test: start_key_test,
    sources: sources
  };
})();
