define(["./keyboard.js"], function(KEYBOARD) {
  var sources        = {}
    , volumes        = {}
    , soundsLoaded   = 0
    , soundsToLoad   = 0
    , DefaultVolume  = 0.3
    , doneLoading    = function() {}
    , ctx
    ;

  var checkKeyboard = function() {
    console.log("inside of sound");
    if(KEYBOARD === undefined) {
      console.log("keyboard is undefined");
    } else if (KEYBOARD) {
      console.log("Keyboard is truthy");
    } else {
      console.log("Keyboard is not truthy but not defined");
    }
  }

  var init = function() {
    if (typeof AudioContext !== "undefined") {
        ctx = new AudioContext();
        console.log("Using AudioContext");
    } else if (typeof webkitAudioContext !== "undefined") {
        ctx = new webkitAudioContext();
        console.log("Using webkitAudioContext");
    } else {
        throw new Error('AudioContext not supported. :(');
    }
  }

  var echoTest = function() {
    echo('Echo test');
    if (ctx !== undefined) {
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

      var currTime = ctx.currentTime;
      volumes['hello'].gain.linearRampToValueAtTime(0, currTime);
      volumes['hello'].gain.linearRampToValueAtTime(1, currTime + 10.1);
    };
  };

  var play = function(ident, volume) {
    if (volume !== undefined) {
      volumes[ident].gain = volume;
    }
    sources[ident].start(ctx.currentTime);
  }

  var loadSound = function(ident, url) {
    echo('starting loadSound');
    soundsToLoad++;
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      var audioData = request.response,
          source    = ctx.createBufferSource();
          buffer    = ctx.createBuffer(audioData, true/*make mono*/);
      source.buffer = buffer;
      sources[ident] = source;

      volumeNode = ctx.createGainNode();
      volumeNode.gain.value = 0.1;
      volumes[ident] = volumeNode;

      source.connect(volumeNode);
      volumeNode.connect(ctx.destination);
      soundsLoaded++;

      echo('ident: ' + ident + 'soundsLoaded: ' + soundsLoaded);
      if (soundsLoaded >= soundsToLoad) {
        doneLoading();
      }
    };

    request.send();
  };

  var makeOscillator = function(ident, freq) {
    var source = ctx.createOscillator();
    source.frequency.value = freq;

    var volumeNode = ctx.createGainNode();
    volumeNode.volume = DefaultVolume;

    source.connect(volumeNode);
    volumeNode.connect(ctx.destination);

    sources[ident] = source;
    volumes[ident] = volumeNode;
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
            soundSource = ctx.createBufferSource();
            soundBuffer = ctx.createBuffer(audioData, true/*make mono*/);

        soundSource.buffer = soundBuffer;
        soundSource.connect(ctx.destination);
        soundSource.start(ctx.currentTime);
    };

    request.send();

  };

  var noteTest = function() {

    $('body').keydown(function(e) {
      if (e.which === 67) {
        if (!KEYBOARD.isPushed(67)) {
          KEYBOARD.push(67);
          makeOscillator('middle c', 400);
          sources['middle c'].start(0);
        }
      }
    });

    $('body').keyup(function(e) {
      if (e.which === 67) {
        sources['middle c'].stop(0);
        KEYBOARD.release(67);
      }
    });
  };

  var startKeyTest = function() {
    loadSound('c', 'audio/pianoMiddleC.mp3');
    doneLoading = function() {
      sources['c'].loop = true;
    }
    $('body').keydown(function(e) {
      if (e.which === 70) {
        sources['c'].start(0);
      }
    });
  };

  init();

  return {
    echoTest: echoTest
  , soundTest: soundTest
  , checkKeyboard: checkKeyboard
  , noteTest: noteTest
  , multiSoundTest: multiSoundTest
  , startKeyTest: startKeyTest
  , sources: sources
  };
});
