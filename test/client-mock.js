var counter = 0;

var ClientMock = function() {
  this.events = {};
  this.counter = {};
  this.responses = {};

  this.on = function(eventType, fn) {
    this.events[eventType] = fn;
  };

  this.emit = function(eventType, e) {
    //increment counter for event
    if (this.counter[eventType] === undefined) {
      this.counter[eventType] = 0;
    }
    this.counter[eventType]++;

    //actually call event
    this.responses[eventType].call(this, e);
  };

  this.respondTo =function(eventType, fn) {
    this.responses[eventType] = fn;
  };

  this.id = "ClientMock" + (counter++);
};

module.exports = ClientMock;

