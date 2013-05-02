var _ = require('underscore')

module.exports = function() {
  var clients = {}
    , intervalLength = 1000
    , intervalID
    , that = this
    ;

  this.start = function() {
    this.stop();
    intervalID = setInterval(queryClients, intervalLength);
    return this;
  };

  this.setIntervalLength = function(length) {
    intervalLength = length;
    return this;
  };


  this.removeClient = function(client) {
    delete clients[client.id];
    return this;
  };

  this.getLag = function(client) {
    var responses = clients[client.id].responses;

    var lag = _.reduce(responses, function(acc, elem, key) {
      return acc + elem;
    }, 0) / responses.length;

    return lag;
  };

  this.getStdDev = function(client) {
    var responses = clients[client.id].responses
      , lag = this.getLag(client)
        ;

    var variance = _.reduce(responses, function(sum, elem, key) {
      var squareDist = Math.pow(elem - lag, 2);
      return sum + squareDist;
    }, 0) / responses.length;

    return Math.sqrt(variance);
  };

  this.stop = function() {
    clearInterval(intervalID);
    return this;
  };

  this.reset = function() {
    this.stop();
    clients = {};
    return this;
  };

  this.addClient = function(client) {
    clients[client.id] = { object: client
                         , responses: [] };

    client.on('lag-response', function(e) {
      var curTime = new Date().getTime()
        , lag = curTime - parseInt(e.time)
        , responses = clients[client.id].responses
        ;

      responses.push(lag);
      if (responses.length > 10) {
        responses.shift();
      }

      lag = that.getLag(client);
    });

    return this;
  };

  var queryClients = function() {
   var e = { time: new Date().getTime() }
    _.each(clients, function(client) {
      client.object.emit('lag-query', e);
    });
  };
};
