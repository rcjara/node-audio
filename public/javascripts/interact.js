define(['./synthesizer.js'], function(synth) {
  var public = {}
    , socket
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
    });

    socket.on('authorized', function(e) {
      echo(e.text);
      call(authorizedCallback);
    });

    socket.on('synth-event', function(e) {
      synth[e.type](e.instrumentName, e.noteName);
    });

    socket.on('message', function(msg) {
      echo(msg.text);
    });

    socket.on('disconnect', function() {
      echo('disconnected ...');
      echo('attempting to reconnect ...');
      socket.socket.reconnect();
    });
  };

  public.emitSynthEvent = function(type, instrument, note) {
    var e = {};

    e.type = type
    e.instrumentName = instrument
    e.noteName = note

    socket.emit('synth-event', e);
  }

  return public;
});
