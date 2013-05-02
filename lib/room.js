var _ = require('underscore')
    , ACCEPTABLE_DELAY = 0.02
    , MINUTE = 60
    ;

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

    var that = this;
    this.intervalPulse = setInterval(function() {
      if (that.updateDelay()) {
        that.emit('set-delay', { delay: that.beatDelay });
        that.emit('message', { text: "Due to lag, the beat delay has been changed to: " + that.beatDelay });
      }
    }, 200);
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
  Room.prototype.updateDelay = function() {
    var newDelay = this.getDelay();

    if (newDelay !== this.beatDelay) {
      this.beatDelay = newDelay;
      return true;
    } else {
      return false;
    }
  };


  Room.prototype.getDelay = function() {
    var that = this
      , intervalLength = MINUTE / this.beatsPerMinute
      ;

    var rawDelay = _.reduce(this.getOccupants(), function(max, client) {
      var lagWithVariance = that.lagDetector.getLag(client) +
                            that.lagDetector.getStdDev(client);
      return max > lagWithVariance ? max : lagWithVariance;
    }, 0);

    var delayInSeconds = rawDelay / 1000;

    return Math.ceil((delayInSeconds - ACCEPTABLE_DELAY) / intervalLength)  };


  return Room;
})();

