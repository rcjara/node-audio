module.exports = (function() {
  var public = {}
    , _ = require('underscore')
    , curID = 0
    , FIRST_NAMES  = [ 'yellow'
                     , 'hardcore'
                     , 'gigantic'
                     , 'jazzy'
                     , 'pedantic' ]
    , MIDDLE_NAMES = [ 'elephant'
                     , 'diamond'
                     , 'robot'
                     , 'alligator'
                     , 'monster' ]
    , LAST_NAMES   = [ 'hoarders'
                     , 'destroyers'
                     , 'players'
                     , 'masters'
                     , 'tricksters' ]
    ;

  public.reset = function() {
    curID = 0;
  };

  public.nameForID = function(id) {
    var I = FIRST_NAMES.length
      , J = MIDDLE_NAMES.length
      , K = LAST_NAMES.length
      , i = Math.floor(id % I)
      , j = Math.floor((id / I) % J)
      , k = Math.floor((id / I / J) % K)
      ;

    return FIRST_NAMES[i] + '-' + MIDDLE_NAMES[j] + '-' + LAST_NAMES[k];
  };

  public.convertFromName = function(name) {
    var array = name.split('-')
      , I = FIRST_NAMES.length
      , J = MIDDLE_NAMES.length
      , K = LAST_NAMES.length
      , i = _.indexOf(FIRST_NAMES, array[0])
      , j = _.indexOf(MIDDLE_NAMES, array[1])
      , k = _.indexOf(LAST_NAMES, array[2])
      ;

    return i + j * I + k * (I * J);
  };

  public.next = function() {
    return public.nameForID(curID++);
  };

  return public;
})();
