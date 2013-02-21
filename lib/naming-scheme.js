module.exports = (function() {
  var public = {}
    , _ = require('underscore')
    , curID = 0
    , NAMES = [ [ 'yellow'
                , 'hardcore'
                , 'gigantic'
                , 'jazzy'
                , 'pedantic' ]
              , [ 'elephant'
                , 'diamond'
                , 'robot'
                , 'alligator'
                , 'monster' ]
              , [ 'hoarders'
                , 'destroyers'
                , 'players'
                , 'masters'
                , 'tricksters' ] ]
    ;



  public.reset = function() {
    curID = 0;
  };

  public.nameForID = function(id) {
    var nextName = function(i, divisor) {
      if (i >= NAMES.length) { return ""; }

      var length = NAMES[i].length
        , nextDivisor = divisor * length
        , name = NAMES[i][Math.floor(id / divisor) % length]
        ;

      return name + "-" + nextName(i + 1, nextDivisor);
    };

    return nextName(0, 1).slice(0, -1);
  };

  public.convertFromName = function(name) {
    var array = name.split('-');

    var lookupNext = function(i, multiplier) {
      if (i >= NAMES.length) { return 0; }

      var length = NAMES[i].length
        , nextMultiplier = multiplier * length
        , index = _.indexOf(NAMES[i], array[i])
        ;

      return (index * multiplier) + lookupNext(i + 1, nextMultiplier);
    };


    return lookupNext(0, 1);
  };

  public.next = function() {
    return public.nameForID(curID++);
  };

  return public;
})();
