define(['mixer'], function(synth) {
  var public = {}
    , socket
    , clientID
    , alertees = []
    ;

  var call = function(callback) {
    if (callback !== undefined) {
      callback();
    }
  }

  public.addAlertee = function(alertee) {
    alertees.push(alertee);
  };

  public.connectToServer = function(authorizedCallback) {
    socket = io.connect('/');

    socket.on('connect', function() {
      echo('connecting to server...');

      //Don't delete commented out line below
      //it's here for debugging purposes
      //setTimeout(function() { socket.disconnect(); }, 1000);
    });

    socket.on('authorized', function(e) {
      echo(e.text);
      clientID = e.clientID;
      console.log('clientID: ' + clientID);
      call(authorizedCallback);

      $.each(alertees, function(i, alertee) {
        alertee.activate();
      });
    });

    socket.on('synth-event', function(e) {
      if (e.type == 'addInstrument') {
        synth[e.type](e.clientID, e.instrumentName);
      } else {
        synth[e.type](e.clientID, e.noteName);
      }
    });

    socket.on('add-instruments', function(e) {
      synth.addInstruments(e.instruments);
    });

    socket.on('message', function(msg) {
      echo(msg.text);
      if (msg.toLog !== undefined) {
        console.log(msg.toLog);
      }
    });

    socket.on('disconnect', function() {
      echo('disconnected ...');
      echo('attempting to reconnect ...');
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

  return public;
});
