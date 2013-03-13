define(['chatCtrl'], function(chatCtrl) {
  var public = {}
    , room
    ;

  public.connection = function() {
    chatCtrl.echo("Connecting to the server...");
  };

  public.authorization = function() {
    chatCtrl.echo("The server has responded...");
  };

  public.newRoom = function(_room, msg) {
    room = _room;
    var socket = room.getSocket();

    chatCtrl.echo(msg.text);

    socket.on('message', function(msg) {
      var display;

      if (typeof msg.userName !== 'undefined') {
        display = msg.userName + ': ' + msg.text;
      } else {
        display = msg.text;
      }
      chatCtrl.echo(display);

      if (typeof msg.toLog !== 'undefined') {
        console.log(msg.toLog);
      }
    });
  };

  public.disconnection = function() {
    chatCtrl.echo("So sorry, the connection to the server has gone down.");
  };

  public.emitMessage = function(text) {
    var e = { text: text };
    room.emit('chat-event', e);
  };

  chatCtrl.activate(public);
  chatCtrl.echo("the controller is hooked up properly");

  return public;
});
