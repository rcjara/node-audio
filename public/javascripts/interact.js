define(function() {
  var socket;


  var connectToServer = function() {
    //here is a comment
    socket = io.connect('/');
    //var socket = require('socket.io')('/');

    socket.on('connect', function () {
      echo('connected');
    });

    socket.on('keypress', function (msg) {
      echo('someone else pressed f');
    });

    socket.on('message', function (msg) {
      echo(msg.text);
    });

    socket.on('disconnect', function () {
      echo('disconnected');
    });


    $('body').keydown(function(e) {
      console.log('keydown');
      if (e.which === 70) {
        echo('I pressed f');
        socket.emit('keypress', {keypress: 70});
      }
    });

  };

  return {
    socket: function() { return socket; },
    connect: connectToServer
  };
});
