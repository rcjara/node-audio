module.exports = (function() {
  var public = {}
    , _ = require('underscore')
    , rooms = {}
    , MAX_OCCUPANTS = 4
    , namingScheme
    , sockets
    ;

  public.setSockets = function(_sockets) {
    sockets = _sockets;
  };

  public.setNamingScheme = function(_scheme) {
    namingScheme = _scheme;
  };

  public.reset = function() {
    namingScheme.reset();
    rooms = {};
  };

  public.generateRoom = function() {
    var name = namingScheme.next();

    var room = { capacity:  MAX_OCCUPANTS
               , name:      name
               , occupants: function() {
                              return sockets.clients(name);
                            }
               , available: function() {
                              return this.occupants().length < this.capacity;
                            }
               };

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

    return rooms[name].available();
  };

  public.firstAvailable = function() {
    var room = _.find(_.values(rooms), function(room) {
      return room.available();
    });

    if (typeof room === 'undefined') { room = public.generateRoom(); }

    return room;
  };

  return public;
})();
