define(['sound'], function(Sound) {
  var public = {}
    , now = function() { return Sound.getCtx().currentTime; }
    , MINUTE = 60
    , beatsPerMinute = 100
    , intervalLength  = MINUTE / beatsPerMinute
    , mixer = false
    , callbackPulse = false
    , startTime
    , timeOffset = 0
    ;


  public.start = function() {
    if (callbackPulse) { clearInterval(callbackPulse); }
    callbackPulse = setInterval(beat, intervalLength * 1000);
    addPulse(1);
    addPulse(2);
  };

  public.getBeat = function() { return public.beatForTime(timeOffset + now()); };

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
    return Math.floor((now() - startTime) / intervalLength);
  };

  public.beatOffset = function() {
    return (now() - startTime) % intervalLength;
  };

  public.timeFromOffset = function(offset, whichBeat) {
    console.log("timeFromOffset: " + offset + " getBeat(): " + public.getBeat());
    if (whichBeat === undefined) { whichBeat = public.getBeat(); }

    var theTime = beatTime(whichBeat) + offset;

    return theTime < now() ? now() : theTime;
  };

  public.setBeat = function(bpm, officialTime) {
    beatsPerMinute = bpm;
    intervalLength = MINUTE / beatsPerMinute;

    timeOffset = officialTime - now();

    public.start();
  };

  var beat = function() {
    addPulse(2);
  };

  var beatTime = function(num) {
    return startTime - timeOffset + (num * intervalLength);
  };


  var addPulse = function(beatsInAdvance) {
    var pulseTime = beatTime(public.getBeat() + beatsInAdvance) - timeOffset;
    mixer.pulse('metronome', ['C5'], pulseTime);
  };


  return public;
});
