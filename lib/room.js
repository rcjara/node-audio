var _ = require('underscore')
  , sockets
  ;

function Room(attr, sockets) {
  var that = this;

  this.name = attr.name;
  this.capacity = attr.capacity;

  this.isAvailable = function() {
    return that.getOccupants().length < that.capacity;
  };

  this.getOccupants = function() {
    return sockets.clients(that.name);
  };
}

exports.Room = Room;
