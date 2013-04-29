define(['sound'], function(Sound) {
  var public = {}
    , now = function() { return Sound.getCtx().currentTime; }
    , MINUTE = 60 * 1000
    , beatNum = 0
    , beatsPerMinute = 100
    , intervalLength  = MINUTE / beatsPerMinute
    , mixer = false
    , callbackPulse = false
    , startTime
    ;


  public.start = function() {
    if (callbackPulse) { clearInterval(callbackPulse); }
    callbackPulse = setInterval(beat, intervalLength);
    addPulse(1);
    addPulse(2);
  };

  public.getBeat  = function() { return beatNum; };

  public.setMixer = function(_mixer) {
    if (mixer) {
      mixer.removeInstrument('metronome');
    }
    mixer = _mixer;
    mixer.addInstrument('metronome', 'metronome');

    startTime = now();

    return public;
  };

  public.beatOffset = function() {
    var offset = (now() - startTime) % (intervalLength / 1000);
    return offset === 0 ? intervalLength / 1000 : offset;
  };

  public.timeFromOffset = function(offset) {
    console.log("timeFromOffset: " + offset + " beatFor: " + beatFor(beatNum + 2));
    return beatFor(beatNum + 1) + offset;
  };

  var beat = function() {
    beatNum++;
    addPulse(2);
  };

  var beatFor = function(num) {
    return startTime + (num * intervalLength / 1000);
  };


  var addPulse = function(beatsInAdvance) {
    var pulseTime = beatFor(beatNum + beatsInAdvance);
    mixer.pulse('metronome', ['C6'], pulseTime);
  };


  return public;
});
