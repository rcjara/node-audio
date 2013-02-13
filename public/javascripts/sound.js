define(function() {
  var public         = {}
    , sources        = {}
    , volumes        = {}
    , soundsLoaded   = 0
    , soundsToLoad   = 0
    , DefaultVolume  = 0.3
    , doneLoading    = function() {}
    , ctx
    ;

  var loadAudioContext = function() {
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

  public.play = function(soundName, volume) {
    if (volume !== undefined) {
      volumes[soundName].gain = volume;
    }
    sources[soundName].start(0);
  };

  public.playNote = function(soundName, freq) {
    makeOscillator(soundName, freq);
    sources[soundName].start(0);
  };

  public.stopPlaying = function(soundName) {
    sources[soundName].stop(0);
  };

  public.loadSound = function(soundName, url) {
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
      sources[soundName] = source;

      volumeNode = ctx.createGainNode();
      volumeNode.gain.value = 0.1;
      volumes[soundName] = volumeNode;

      source.connect(volumeNode);
      volumeNode.connect(ctx.destination);
      soundsLoaded++;

      echo('soundName: ' + soundName + 'soundsLoaded: ' + soundsLoaded);
      if (soundsLoaded >= soundsToLoad) {
        doneLoading();
      }
    };

    request.send();
  };

  var makeOscillator = function(soundName, freq) {
    if (sources[soundName]) { stop(soundName); }

    var source = ctx.createOscillator();
    var volumeNode = createVolumeNode(soundName);

    source.connect(volumeNode);
    source.frequency.value = freq;

    sources[soundName] = source;
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

  public.soundTest = function() {
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

  loadAudioContext();

  return public;
});
