define(['./keyboardSynth.js'], function(synth) {
  var public = {}
    , socket
    ;

  public.connectToServer = function() {
    //here is a comment
    socket = io.connect('/');
    //var socket = require('socket.io')('/');

    socket.on('connect', function () {
      echo('connected');
    });

    socket.on('keydown', function (msg) {
      synth.keydown(msg.key);
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
