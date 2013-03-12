define([], function() {
  var public = {}
    , room;

  public.connection = function() {
    echo("Connecting to the server...");
  };

  public.authorization = function() {
    echo("The server has responded...");
  };

  public.newRoom = function(_room, msg) {
    room = _room;
    var socket = room.getSocket();

    echo(msg.text);

    socket.on('message', function(msg) {
      echo(msg.text);

      if (msg.toLog !== undefined) {
        console.log(msg.toLog);
      }
    });
  };

  public.disconnection = function() {
    echo("So sorry, the connection to the server has gone down.");
  };

  var echo = function(text) {
    $('#messages').append($('<p>' + text + '</p>'));
  };

  return public;
});
