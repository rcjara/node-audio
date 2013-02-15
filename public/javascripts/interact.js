define(['./keyboardSynth.js'], function(synth) {
  var public = {}
    , socket
    ;

  public.connectToServer = function() {
    socket = io.connect('/');

    socket.on('connect', function () {
      echo('connecting to server...');
    });

    socket.on('keydown', function (msg) {
      synth.startNote(msg.key);
    });

    socket.on('keyup', function (msg) {
      synth.keyup(msg.key);
    });

    socket.on('message', function (msg) {
      echo(msg.text);
    });

    socket.on('disconnect', function () {
      echo('disconnected');
    });


    $('body').keydown(function(e) {
      socket.emit('keydown', { key: e.which});
    });

    $('body').keyup(function(e) {
      socket.emit('keyup', { key: e.which});
    });

  };

  return public;
});
