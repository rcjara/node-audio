require(['socket'], function(io) {
  /* Handles direct interactions with the server.
     Rebroadcasts certain events to its subscribers
     In order to receive the message, the subscriber simply
     has to implement the function on its public interface.

     Supported events:
       connection      // communication with the server begins
       authorization   // communication with the server
       acceptance
  */
  var public = {}
    , socket
    , clientID
    , accepted = false;
    , subscribers = []
    , historyState = 0
    ;

  public.emit = function(eventType, e) {
    if (accepted === false) {
      console.log('attempted to emit a message before acceptance');
      console.log(e);
    }
    e.clientID = clientID;
    socket.emit(eventType, e);
  };

  public.subscribe = function(alertee) {
    subscribers.push(alertee);
  };

  var broadcast = function(msg, e) {
    _.each(subscribers, function(subscriber) {
      if (typeof subscriber[msg] !== undefined) {
        subscriber[msg](public, e);
      }
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

  public.connectToServer = function(authorizedCallback) {
    socket = io.connect('/');

    socket.on('connect', function() {
      broadcast('connection', {});
    });

    socket.on('authorized', function(e) {
      clientID = e.clientID;
      console.log('clientID: ' + clientID);
      requestRoom();

      broadcast('authorization', {});
    });

    socket.on('join-room', function(msg) {
      updateURLToRoom(msg.room);
      accepted = true;

      broadcast('acceptance', { msg: msg.text });
    });

    socket.on('disconnect', function() {
      socket.socket.reconnect();
      accepted = false;

      broadcast('disconnection', {});
    });
  }
});

