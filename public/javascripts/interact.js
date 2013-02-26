define(['mixer'], function(synth) {
  var public = {}
    , socket
    , clientID
    , alertees = []
    , historyState = 0
    ;

  var call = function(callback) {
    if (callback !== undefined) {
      callback();
    }
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

  public.addAlertee = function(alertee) {
    alertees.push(alertee);
  };

  public.connectToServer = function(authorizedCallback) {
    socket = io.connect('/');

    socket.on('connect', function() {
      public.echo('connecting to server...');

      //Don't delete commented out line below
      //it's here for debugging purposes
      //setTimeout(function() { socket.disconnect(); }, 1000);
    });

    socket.on('authorized', function(e) {
      public.echo(e.text);
      clientID = e.clientID;
      console.log('clientID: ' + clientID);
      requestRoom();
      call(authorizedCallback);
    });

    socket.on('synth-event', function(e) {
      if (e.type === 'start') {
        $('#play-area').removeClass('beat-pulse-run');
        setTimeout(function() {
          $('#play-area').addClass('beat-pulse-run');
        }, 10);
      }

      if (e.type === 'addInstrument') {
        synth[e.type](e.clientID, e.instrumentName);
      } else {
        synth[e.type](e.clientID, e.noteName);
      }
    });

    socket.on('add-instruments', function(e) {
      synth.addInstruments(e.instruments);
    });

    socket.on('join-room', function(msg) {
      public.echo(msg.text);

      $.each(alertees, function(i, alertee) {
        alertee.activate();
      });

      updateURLToRoom(msg.room);
    });

    socket.on('message', function(msg) {
      if (msg.originator !== clientID) {
        public.echo(msg.text);
      }
      if (msg.toLog !== undefined) {
        console.log(msg.toLog);
      }
    });

    socket.on('disconnect', function() {
      public.echo('disconnected ...');
      public.echo('attempting to reconnect ...');
      socket.socket.reconnect();

      $.each(alertees, function(i, alertee) {
        alertee.deactivate();
      });
    });
  };

  public.emitSynthEvent = function(type, instrument, note) {
    var e = {};

    e.type = type;
    e.clientID = clientID;
    e.instrumentName = instrument;
    e.noteName = note;
    console.log(e)

    socket.emit('synth-event', e);
  }

  public.echo = function(text) {
    $('#messages').append($('<p>' + text + '</p>'));
  };


  return public;
});
