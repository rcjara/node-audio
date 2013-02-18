module.exports = (function() {
  console.log("loading server_size.js");
  var public = {}
    , socket
    , io
    ;

  var notifyClientOfHistory = function(client) {
    //send old clients to the newly connected client
    var clients = io.sockets.clients();
    var instruments = [];
    for (var i = 0; i < clients.length; i++) {
      var c = clients[i];
      if (c.id != client.id) {
        instruments.push("piano-" + c.id);
      }
    }
    client.emit('add-instruments', { names: instruments });

    client.broadcast.emit('message', { text: 'Someone just connected.' });
  };

  var setupClientEvents = function(client) {
    client.on('synth-event', function(e) {
      client.broadcast.emit('synth-event', e);
      client.emit('synth-event', e);
    });

    client.on('disconnect', function(e) {
      client.broadcast.emit('synth-event', { type: "removeInstrument"
                                           , instrumentName: "piano-" + client.id
                                           });
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
