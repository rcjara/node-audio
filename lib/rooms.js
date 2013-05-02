module.exports = (function() {
  var public = {}
    , _ = require('underscore')
    , Room = require('./room.js')
    , rooms = {}
    , MAX_OCCUPANTS = 4
    , namingScheme
    , lagDetector
    , sockets
    ;

  public.setSockets = function(_sockets) {
    sockets = _sockets;
    return public;
  };

  public.setLagDetector = function(_lagDetector) {
    lagDetector = _lagDetector;
    console.log("the lag detector is : " + lagDetector);
    return public;
  };

  public.setNamingScheme = function(_scheme) {
    namingScheme = _scheme;
    return public;
  };

  public.reset = function() {
    namingScheme.reset();
    rooms = {};
  };

  public.generateRoom = function() {
    var name = namingScheme.next()
      , attr = { capacity: MAX_OCCUPANTS
               , name: name
               , bpm: 100
               , lagDetector: lagDetector }
      , room = new Room(attr, sockets);

    rooms[name] = room;

    return room;
  };

  public.getRoom = function(name) {
    return rooms[name];
  };

  public.isAvailable = function(name) {
    if (typeof rooms[name] === 'undefined') {
      return false;
    }

    return rooms[name].isAvailable();
  };

  public.firstAvailable = function() {
    var room = _.find(_.values(rooms), function(room) {
      return room.isAvailable();
    });

    if (typeof room === 'undefined') { room = public.generateRoom(); }

    return room;
  };

  return public;
})();
