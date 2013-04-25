define([], function() {
  var public = {}
    , MINUTE = 60 * 1000
    , beatNum = 0
    , beatsPerMinute = 100
    , beatCB
    , pulse
    ;

  public.getBeat  = function() { return beatNum; };
  public.setBeatCB = function(_beatCB) { beatCB = _beatCB; };

  public.start = function() {
    pulse = setInterval(beat, MINUTE / beatsPerMinute);
  };


  var beat = function() {
    beatNum++;
    beatCB();
  };

  return public;
});
