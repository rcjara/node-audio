define(['socket'], function(io) {
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
    , socket
    , clientID
    , accepted = false
    , subscribers = []
    , historyState = 0
    ;

  public.connectToServer = function() {
    socket = io.connect('/');

    setUpSocketListeners();
  }

  public.emit = function(eventType, e) {
    if (accepted === false) {
      console.log('attempted to emit a message before acceptance');
      console.log(e);
    }
    e.clientID = clientID;
    socket.emit(eventType, e);
  };

  public.subscribe = function(subscriber) {
    subscribers.push(subscriber);
  };

  public.getSocket = function() {
    return socket;
  };

  var broadcast = function(msg, e) {
    $.each(subscribers, function(i, subscriber) {
      if (typeof subscriber[msg] === 'function') {
        subscriber[msg](public, e);
      }
    });
  };

  var setUpSocketListeners = function() {
    socket.on('connect', function() {
      broadcast('connection', {});
    });

    socket.on('authorized', function(e) {
      clientID = e.clientID;
      console.log('clientID: ' + clientID);
      broadcast('authorization', {});

      requestRoom();
    });

    socket.on('join-room', function(msg) {
      updateURLToRoom(msg.room);
      accepted = true;

      broadcast('newRoom', msg);
    });

    socket.on('disconnect', function() {
      socket.socket.reconnect();
      accepted = false;

      broadcast('disconnection', {});
    });
  };


  var updateURLToRoom = function(roomName) {
    history.pushState({ state: historyState++ }, '', '/room/' + roomName);
  };

  var requestRoom = function() {
    var $roomName = $('#room-name');
    if ($roomName.length == 0) {
      socket.emit('request-room', {});
    } else if ($roomName.val() === '') {
      socket.emit('request-room', {});
    } else {
      socket.emit('request-room', { room: $roomName.val() });
    }
  };

  return public;
});

