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
      soundsLoaded  = 0,
      soundsToLoad = 0,
      doneLoading   = function() {};

  var echoTest = function() {
    echo('Echo test');
    if (audioCtx !== undefined) {
      echo('Audio context exists');
    }
  };

  var multiSoundTest = function() {
    echo('starting multiSoundTest');

    loadSound('beep', 'audio/beep-1.mp3');
    loadSound('hello', 'http://thelab.thingsinjars.com/web-audio-tutorial/hello.mp3');

    doneLoading = function() {
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

  var loadSound = function(ident, url) {
    echo('starting loadSound');
    soundsToLoad++;
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
      soundsLoaded++;

      echo('ident: ' + ident + 'soundsLoaded: ' + soundsLoaded);
      if (soundsLoaded >= soundsToLoad) {
        doneLoading();
      }
    };

    request.send();
  };

  var makeOscillator = function(ident, freq) {
    var source = audioCtx.createOscillator();
    source.frequency.value = freq;

    var gainNode = audioCtx.createGainNode();

  }

  var soundTest = function() {
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

  var noteTest.

  var startKeyTest = function() {
    loadSound('c', 'audio/pianoMiddleC.mp3');
    doneLoading = function() {
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
    echoTest: echoTest,
    soundTest: soundTest,
    multiSoundTest: multiSoundTest,
    startKeyTest: startKeyTest,
    sources: sources
  };
})();
