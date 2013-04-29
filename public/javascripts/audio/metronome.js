define([], function() {
  var public = {}
    , ctx
    , now
    , MINUTE = 60 * 1000
    , beatNum = 0
    , beatsPerMinute = 100
    , mixer = false
    , callbackPulse = false
    , startTime
    ;


  public.start = function() {
    if (callbackPulse) { clearInterval(callbackPulse); }
    callbackPulse = setInterval(beat, MINUTE / beatsPerMinute);
    addPulse(1);
    addPulse(2);
  };

  public.getBeat  = function() { return beatNum; };

  public.setContext = function(_ctx) {
    ctx = _ctx;
    now = function() { return ctx.currentTime; }
    startTime = now();
  };

  public.setMixer = function(_mixer) {
    if (mixer) {
      mixer.removeInstrument('metronome');
    }
    mixer = _mixer;
    mixer.addInstrument('metronome', 'metronome');

    return public;
  };

  var beat = function() {
    beatNum++;
    addPulse(2);
  };

  var beatFor = function(num) {
    startTime + (num * MINUTE / beatsPerMinute);
  };


  var addPulse = function(beatsInAdvance) {
    var pulseTime = beatFor(beatNum + beatsInAdvance);
    mixer.pulse('metronome', ['C8'], pulseTime);
  };


  return public;
});
