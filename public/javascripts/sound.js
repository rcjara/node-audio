define(function() {
  var sources        = {}
    , volumes        = {}
    , soundsLoaded   = 0
    , soundsToLoad   = 0
    , DefaultVolume  = 0.3
    , doneLoading    = function() {}
    , ctx
    ;

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
  };

  var play = function(ident, volume) {
    if (volume !== undefined) {
      volumes[ident].gain = volume;
    }
    sources[ident].start(ctx.currentTime);
  };

  var playNote = function(ident, freq) {
    makeOscillator(ident, freq);
    sources[ident].start(0);
  };

  var stopPlaying = function(ident) {
    sources[ident].stop(0);
  };

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
    if (sources[ident]) { stop(ident); }

    var source = ctx.createOscillator();
    var volumeNode = createVolumeNode(ident);

    source.frequency.value = freq;
    source.connect(volumeNode);
    volumeNode.connect(ctx.destination);

    sources[ident] = source;
    return source;
  };

  var createVolumeNode = function(ident, volume) {
    if (volume === undefined) {
      volume = DefaultVolume;
    }

    if (!volumes[ident]) {
      var volumeNode = ctx.createGainNode();
      volumeNode.volume = volume;
      volumes[ident] = volumeNode;
    }

    return volumes[ident];
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

  init();

  return {
    play:        play
  , playNote:    playNote
  , stopPlaying: stopPlaying
  , loadSound:   loadSound
  , soundTest:   soundTest
  };
});
