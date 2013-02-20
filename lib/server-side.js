module.exports = (function() {
  console.log("debug: loading server_size.js");
  var public = {}
    , socket
    , rooms = require('./rooms.js')
    , clients = {}
    , io
    ;

  public.start = function(socket, httpServer) {
    io = socket.listen(httpServer);

    io.on('connection', function(client) {
      client.emit('authorized', { text: 'Connected.  Welcome to Jam-r.'
                                , clientID: client.id
                                });

      createClientRecord(client);
      sendClientToRoom(client, firstAvailableRoom());
      notifyClientOfHistory(client);
      setupClientEvents(client);
    });

    return public;
  };

  var createClientRecord = function(client) {
    clients[client.id] = { instrument: ''
                         , room: ''
                         };
  };

  var sendClientToRoom = function(client, room) {
    if (typeof room === 'undefined') { room = firstAvailableRoom(); }

    client.join(room.name);
    clients[client.id].room = room.name;
    client.emit('join-room', { text: "You have joined room: " + room.name
                             , room: room.name
                             });
  };

  var broadcastToClientRoom = function(client, type, msg) {
    var roomName = clients[client.id].room;
    io.sockets.in(roomName).emit(type, msg);
  };

  var firstAvailableRoom = function() {
    room = rooms.firstAvailable();
    if (room === null) {
      room = rooms.generateRoom();
      room.occupancy = function() {
        return io.sockets.clients(room.name).length;
      }
    };

    console.log("debug: firstAvailableRoom: " + JSON.stringify(room));
    return room;
  };

  var notifyClientOfHistory = function(client) {
    var instruments = []
      , roomName = clients[client.id].room
      , clientsForRoom = io.sockets.clients(roomName)
      ;

    for (var i = 0; i < clientsForRoom.length; i++) {
      console.log("debug: notifyClientOfHistory: clientID's:" + JSON.stringify(clientsForRoom[i].id));
      var curID = clientsForRoom[i].id;
      if (curID !== client.id) {
        instruments.push( { ident: curID
                          , name:  clients[curID].instrument });
      }
    }
    if (instruments.length === 0) { console.log('returning early from notifyClientOfHistory'); return; }
    client.emit('add-instruments', { instruments: instruments });
    broadcastToClientRoom(client, 'message', { text: 'Someone just connected to the room.'
                                             , originator: client.id });
  };

  var broadcastSynthEvent = function(client, e) {
    broadcastToClientRoom(client, 'synth-event', e);

    console.log("debug: broadcastSynthEvent: " + JSON.stringify(e));

    if (e.type === "addInstrument") {
      console.log("debug: addInstrument: instruments:" + client.id);
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
    delete clients[client.id];
  };

  var setupClientEvents = function(client) {
    client.on('synth-event', function(e) {
      broadcastSynthEvent(client, e);
    });

    client.on('disconnect', function(e) {
      removeClient(client);
    });
  }

  return public;
})();
