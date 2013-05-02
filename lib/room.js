var _ = require('underscore');

module.exports = (function() {
  var now = function() {
    new Date().getTime();
  };

  function Room(attr, sockets) {
    var that = this;

    this.name = attr.name;
    this.capacity = attr.capacity;
    this.startTime = now();
    this.beatsPerMinute = attr.bpm;
    this.beatDelay = 0;

    this.isAvailable = function() {
      return that.getOccupants().length < that.capacity;
    };

    this.getOccupants = function() {
      return sockets.clients(that.name);
    };

    this.emit = function(type, e) {
      sockets.in(that.name).emit(type, e);
    }
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

