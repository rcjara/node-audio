var _ = require('underscore');

module.exports = (function() {
  var now = function() {
    new Date().getTime();
  };

  function Room(attr, sockets) {
    this.name           = attr.name;
    this.capacity       = attr.capacity;
    this.beatsPerMinute = attr.bpm;
    this.lagDetector    = attr.lagDetector;

    this.sockets = sockets
    this.startTime = now();
    this.beatDelay = 0;

  }

  Room.prototype.isAvailable = function() {
    return this.getOccupants().length < this.capacity;
  };

  Room.prototype.getOccupants = function() {
    return this.sockets.clients(this.name);
  };

  Room.prototype.emit = function(type, e) {
    this.sockets.in(this.name).emit(type, e);
  }

  Room.prototype.officialTime = function() {
    return (now() - this.startTime) / 1000;
  };

  //returns true if the delay was actually changed
  Room.prototype.updateDelay = function(detector) {
    var newDelay = this.getDelay(detector);

    if (newDelay !== this.beatDelay) {
      this.beatDelay = newDelay;
      return true;
    } else {
      return false;
    }
  };


  Room.prototype.getDelay = function(detector) {
    return _.reduce(this.getOccupants(), function(max, client) {
      var lagWithVariance = detector.getLag(client) +
                            detector.getStdDev(client);
      return max > lagWithVariance ? max : lagWithVariance;
    }, 0);
  };


  return Room;
})();

