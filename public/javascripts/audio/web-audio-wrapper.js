define(function() {
  var public         = {}
    , sources        = {}
    , volumes        = {}
    , destination
    , soundsLoaded   = 0
    , soundsToLoad   = 0
    , DEFAULT_VOLUME = 0.3
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

    setupDynamicCompressor();
  };

  var setupDynamicCompressor = function() {
    /* We want all sound to be routed through
     * the compressor to avoid clipping,
     * so the compressor will pretend to be
     * the final destination */
    destination = ctx.createDynamicsCompressor();
    destination.connect(ctx.destination);
    destination.threshold.value = -60;
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

  var createVolumeNode = function(soundName, volume) {
    if (volume === undefined) { volume = DEFAULT_VOLUME; }

    if (volumes[soundName]) {
      var volumeNode = volumes[soundName];
    } else {
      var volumeNode = ctx.createGainNode();
      volumeNode.volume = volume;
      volumes[soundName] = volumeNode;
    }

    volumeNode.connect(destination);
    return volumeNode;
  }

  public.soundTest = function() {
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
        soundSource.noteOn(ctx.currentTime);
    };

    request.send();

  };

  public.getCtx  = function() { return ctx; };
  public.getDest = function() { return destination; };

  loadAudioContext();

  return public;
});
