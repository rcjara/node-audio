module.exports = (function() {
  var public = {}
    , _ = require('underscore')
    , clients = {}
    , intervalLength = 1000
    , intervalID
    ;

  public.start = function() {
    public.stop();
    intervalID = setInterval(queryClients, intervalLength);
    return public;
  };

  public.setIntervalLength = function(length) {
    intervalLength = length;
    return public;
  };


  public.removeClient = function(client) {
    delete clients[client.id];
    return public;
  };

  public.getLag = function(client) {
    var responses = clients[client.id].responses;

    var lag = _.reduce(responses, function(acc, elem, key) {
      return acc + elem;
    }, 0) / responses.length;

    return lag;
  };

  public.stop = function() {
    clearInterval(intervalID);
    return public;
  };

  public.reset = function() {
    public.stop();
    clients = {};
    return public;
  };


  public.addClient = function(client) {
    clients[client.id] = { client: client
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

      //lag = public.getLag(client);
      //client.emit('message', { text: 'Lag: ' + lag });
    });

    return public;
  };

  var queryClients = function() {
   var e = { time: new Date().getTime() }
    _.map(clients, function(clientData) {
      clientData.client.emit('lag-query', e);
    });
  };

  return public;
})();
