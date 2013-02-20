module.exports = (function() {
  var public = {}
    , _ = require('underscore')
    , rooms = {}
    , roomNum = 0
    , MAX_OCCUPANTS = 4
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
    roomNum = 0;
    rooms = {};
  };

  public.nameForID = function(roomID) {
    var I = FIRST_NAMES.length
      , J = MIDDLE_NAMES.length
      , K = LAST_NAMES.length
      , i = Math.floor(roomID % I)
      , j = Math.floor((roomID / I) % J)
      , k = Math.floor((roomID / I / J) % K)
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

  public.generateRoom = function() {
    var name = public.nameForID(roomNum);

    rooms[name] = { capacity: MAX_OCCUPANTS
                  , name:     name
                  };

    roomNum++;
    return rooms[name];
  };

  public.getRoom = function(name) {
    return rooms[name];
  };

  public.firstAvailable = function() {
    var found = _.find(_.values(rooms), function(room) {
      return room.occupancy() < room.capacity
    });

    return (typeof found === 'undefined') ? null : found;
  };

  return public;
})();
