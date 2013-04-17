define(  ['socket', 'mockServer'],
  function(io,       mockServer) {
  /* Handles direct interactions with the server.
     Rebroadcasts certain events to its subscribers
     In order to receive the message, the subscriber simply
     has to implement the function on its public interface.

     Supported events:
       connection      // communication with the server begins
       authorization   // the client now has an id
       acceptance      // the client is now in a room
  */
  var public = {}
    , server
    , clientID
    , accepted = false
    , userName = 'NotSet'
    , subscribers = []
    , historyState = 0
    , roomName = null
    ;

  public.connectToServer = function() {
    server = io.connect('/');
    setUpListeners();
  }

  public.connectLocally = function() {
    server = mockServer;
    setUpListeners();

    server.connect();
  };


  public.emit = function(eventType, e) {
    if (accepted === false) {
      console.log('attempted to emit a message before acceptance');
      console.log(e);
    }
    e.clientID = clientID;
    server.emit(eventType, e);
  };

  public.setUserName = function(name) {
    userName = name;
  };


  public.on = function(msgType, cb) {
    server.on(msgType, cb);
  };

  public.subscribe = function(subscriber) {
    subscribers.push(subscriber);
  };

  public.setRoomName = function(name) {
    roomName = name;
  }

  public.shouldIgnore = function(msg) {
    if (msg.originator === undefined) { return false; }
    return msg.originator === clientID;
  }

  var broadcast = function(msg, e) {
    $.each(subscribers, function(i, subscriber) {
      if (typeof subscriber[msg] === 'function') {
        subscriber[msg](public, e);
      }
    });
  };

  var setUpListeners = function() {
    server.on('connect', function() {
      broadcast('connection', {});
    });

    server.on('authorized', function(e) {
      clientID = e.clientID;
      broadcast('authorization', {});

      requestRoom();
    });

    server.on('join-room', function(msg) {
      updateURLToRoom(msg.room);
      accepted = true;
      public.emit('set-username', { userName: userName });

      broadcast('newRoom', msg);
    });

    server.on('disconnect', function() {
      server.socket.reconnect();
      accepted = false;

      broadcast('disconnection', {});
    });

    server.on('connection-error', function(e) {
      userName = 'NotSet';
      resetURL();
    });

    server.on('lag-query', function(e) {
      public.emit('lag-response', e);
    });
  };


  var updateURLToRoom = function(roomName) {
    history.pushState({ state: historyState++ }, '', '/room/' + roomName);
  };

  var resetURL = function() {
    history.pushState({ state: historyState++ }, '', '/');
  };

  var requestRoom = function() {
    if (roomName) {
      server.emit('request-room', { room: roomName });
    } else {
      server.emit('request-room', {});
    }
  };

  return public;
});

