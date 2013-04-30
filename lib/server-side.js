module.exports = (function() {
  var public = {}
    , clients = {}
    , LagDetector = require('./lag-detector')
    , lagDetector = new LagDetector()
    , socket
    , io
    , rooms
    ;

  public.start = function(_socket, _httpServer, _rooms) {
    io = _socket.listen(_httpServer);
    rooms = _rooms;
    rooms.setSockets(io.sockets);
    lagDetector.start();

    io.on('connection', function(client) {
      client.emit('authorized', { text: 'Connected.  Welcome to Jam-r.'
                                , clientID: client.id
                                });

      lagDetector.addClient(client);
      createClientRecord(client);
      setupClientEvents(client);
    });

    return public;
  };

  var createClientRecord = function(client) {
    clients[client.id] = { instrument: ''
                         , room: ''
                         , userName: 'NameNotEntered'
                         };
  };

  var connectionError = function(client) {
    client.emit('connection-error', { text: 'There was a connection error. Please reload the page.' });
  };

  var sendClientToRoom = function(client, room) {
    if (typeof room === 'undefined') {
      return connectionError(client);
    }

    var clientRecord = clients[client.id];
    if (clientRecord.room !== '') {
      client.leave('/' + clientRecord.room);
    }

    client.join(room.name);
    clientRecord.room = room.name;
    client.emit('join-room', { text: "You have joined room: " + room.name
                             , room: room.name
                             });

    notifyClientOfHistory(client);
  };

  var broadcastToClientRoom = function(client, type, msg) {
    var roomName = clients[client.id].room;
    io.sockets.in(roomName).emit(type, msg);
  };

  var notifyClientOfHistory = function(client) {
    var instruments = []
      , roomName = clients[client.id].room
      , clientsForRoom = io.sockets.clients(roomName)
      ;

    for (var i = 0; i < clientsForRoom.length; i++) {
      var curID = clientsForRoom[i].id;
      if (curID !== client.id) {
        instruments.push( { ident: curID
                          , name:  clients[curID].instrument });
      }
    }
    if (instruments.length === 0) { return; }

    client.emit('add-instruments', { instruments: instruments });
  };

  var broadcastSynthEvent = function(client, e) {
    broadcastToClientRoom(client, 'synth-event', e);

    if (e.type === "addInstrument") {
      clients[client.id].instrument = e.instrumentName;
    } else if (e.type === "removeInstrument") {
      delete clients[e.clientID].instrument;
    }
  };

  var removeClient = function(client) {
    var roomName = clients[client.id].room;
    broadcastToClientRoom(client, 'synth-event', { type: "removeInstrument"
                                                 , instrumentName: client.id
                                                 });
    lagDetector.removeClient(client);
    delete clients[client.id];
  };

  var setupClientEvents = function(client) {
    client.on('synth-event', function(e) {
      broadcastSynthEvent(client, e);
    });

    client.on('disconnect', function() {
      removeClient(client);
    });

    client.on('request-room', function(e) {
      if (typeof e.room !== 'undefined') {
        sendClientToRoom(client, rooms.getRoom(e.room));
      } else {
        sendClientToRoom(client, rooms.firstAvailable());
      }
    });

    client.on('request-beat', function() {
      var room = clients[client.id].room;
      client.emit('set-beat', { bpm: room.beatsPerMinute
                              , officialTime: room.officialTime() });
    });

    client.on('chat-event', function(e) {
      e.userName = clients[client.id].userName;
      broadcastToClientRoom(client, 'message', e);
    });

    client.on('set-username', function(e) {
      clients[client.id].userName = e.userName;
      broadcastToClientRoom(client
                          , 'message'
                          , { text: clients[client.id].userName + ' just joined the room.'
                            , originator: client.id });
    });
  }

  return public;
})();
