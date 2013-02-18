define(['./synthesizer.js'], function(synth) {
  var public = {}
    , socket
    , clientID
    ;

  var call = function(callback) {
    if (callback !== undefined) {
      callback();
    }
  }

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
      call(authorizedCallback);
    });

    socket.on('synth-event', function(e) {
      if (e.noteName === undefined) {
        synth[e.type](e.instrumentName);
      } else {
        synth[e.type](e.instrumentName, e.noteName);
      }
    });

    socket.on('add-instruments', function(e) {
      synth.addInstruments(e.names);
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
    });
  };

  public.emitSynthEvent = function(type, instrument, note) {
    var e = {};

    e.type = type;
    e.instrumentName = instrument + '-' + clientID;
    e.noteName = note;
    console.log(e)

    socket.emit('synth-event', e);
  }

  return public;
});
