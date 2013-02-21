module.exports = (function() {
  var public = {}
    , _ = require('underscore')
    , rooms = {}
    , MAX_OCCUPANTS = 4
    , namingScheme
    ;

  public.setNamingScheme = function(_scheme) {
    namingScheme = _scheme;
  };

  public.reset = function() {
    namingScheme.reset();
    rooms = {};
  };

  public.generateRoom = function() {
    var name = namingScheme.next();

    rooms[name] = { capacity: MAX_OCCUPANTS
                  , name:     name
                  };

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
