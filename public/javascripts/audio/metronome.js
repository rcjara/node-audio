define(['sound'], function(Sound) {
  var public = {}
    , now = function() { return Sound.getCtx().currentTime; }
    , MINUTE = 60 * 1000
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

  public.getBeat = function() { return public.beatForTime(now()); };

  public.setMixer = function(_mixer) {
    if (mixer) {
      mixer.removeInstrument('metronome');
    }
    mixer = _mixer;
    mixer.addInstrument('metronome', 'metronome');

    startTime = now();

    return public;
  };

  public.beatForTime = function(time) {
    return Math.floor((now() - startTime) * 1000 / intervalLength);
  };

  public.beatOffset = function() {
    return (now() - startTime) % (intervalLength / 1000);
  };

  public.timeFromOffset = function(offset, whichBeat) {
    console.log("timeFromOffset: " + offset + " getBeat(): " + public.getBeat());
    if (whichBeat === undefined) { whichBeat = public.getBeat(); }

    var theTime = beatTime(whichBeat) + offset;

    return theTime < now() ? now() : theTime;
  };

  var beat = function() {
    addPulse(2);
  };

  var beatTime = function(num) {
    return startTime + (num * intervalLength / 1000);
  };


  var addPulse = function(beatsInAdvance) {
    var pulseTime = beatTime(public.getBeat() + beatsInAdvance);
    mixer.pulse('metronome', ['C5'], pulseTime);
  };


  return public;
});
