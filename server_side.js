module.exports = (function() {
  console.log("debug: loading server_size.js");
  var public = {}
    , socket
    , clientInstruments = {}
    , io
    ;

  var notifyClientOfHistory = function(client) {
    var instruments = [];
    for (var clientID in clientInstruments) {
      console.log("debug: notifyClientOfHistory: clientID's:" + clientID);
      if (clientID !== client.id) {
        instruments.push( { ident: clientID
                          , name: clientInstruments[clientID] });
      }
    }
    console.log("debug: notifyClientOfHistory: instruments:" + instruments.length);
    client.emit('add-instruments', { instruments: instruments });
    client.broadcast.emit('message', { text: 'Someone just connected.' });
  };

  var broadcastSynthEvent = function(client, e) {
    client.broadcast.emit('synth-event', e);
    client.emit('synth-event', e);

    if (e.type === "addInstrument") {
      console.log("debug: addInstrument: instruments:" + client.id);
      clientInstruments[e.clientID] = e.instrumentName;
    } else if (e.type === "removeInstrument") {
      delete clientInstruments[e.clientID];
    }
  };

  var removeClient = function(client) {
    delete clientInstruments[client.id];
    client.broadcast.emit('synth-event', { type: "removeInstrument"
                                         , instrumentName: client.id
                                         });
  };

  var setupClientEvents = function(client) {
    client.on('synth-event', function(e) {
      broadcastSynthEvent(client, e);
    });

    client.on('disconnect', function(e) {
      removeClient(client);
    });
  }

  public.start = function(socket, httpServer) {
    io = socket.listen(httpServer);

    io.on('connection', function(client) {
      client.emit('authorized', { text: 'Connected.  Welcome to Jam-r.'
                                , clientID: client.id
                                });

      notifyClientOfHistory(client);
      setupClientEvents(client);
    });

    return public;
  };

  return public;
})();
