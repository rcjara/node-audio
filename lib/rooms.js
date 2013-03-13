var _ = require('underscore')
  , Room = require('./room.js').Room
  , rooms = {}
  , MAX_OCCUPANTS = 4
  , namingScheme
  , sockets
  ;

exports.setSockets = function(_sockets) {
  sockets = _sockets;
};

exports.setNamingScheme = function(_scheme) {
  namingScheme = _scheme;
};

exports.reset = function() {
  namingScheme.reset();
  rooms = {};
};

exports.generateRoom = function() {
  var name = namingScheme.next()
    , attr = { capacity: MAX_OCCUPANTS, name: name }
    , room = new Room(attr, sockets);

  rooms[name] = room;

  return room;
};

exports.getRoom = function(name) {
  return rooms[name];
};

exports.isAvailable = function(name) {
  if (typeof rooms[name] === 'undefined') {
    return false;
  }

  return rooms[name].isAvailable();
};

exports.firstAvailable = function() {
  var room = _.find(_.values(rooms), function(room) {
    return room.isAvailable();
  });

  if (typeof room === 'undefined') { room = exports.generateRoom(); }

  return room;
};
