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

    this.isAvailable = function() {
      return that.getOccupants().length < that.capacity;
    };

    this.getOccupants = function() {
      return sockets.clients(that.name);
    };
  }

  Room.prototype.officialTime = function() {
    return (now() - this.startTime) / 1000;
  };

  return Room;
})();

