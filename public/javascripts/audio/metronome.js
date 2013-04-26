define([], function() {
  var public = {}
    , MINUTE = 60 * 1000
    , beatNum = 0
    , beatsPerMinute = 100
    , beatCB
    , pulse = false;
    ;



  public.start = function() {
    if (pulse) { clearInterval(pulse); }
    pulse = setInterval(beat, MINUTE / beatsPerMinute);
  };

  public.getBeat   = function() { return beatNum; };
  public.setBeatCB = function(_beatCB) {
    beatCB = _beatCB;
  };

  var beat = function() {
    beatNum++;
    beatCB();
  };

  return public;
});
