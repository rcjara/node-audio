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
      chatCtrl.echo(msg.text);

      if (msg.toLog !== undefined) {
        console.log(msg.toLog);
      }
    });
  };

  public.disconnection = function() {
    chatCtrl.echo("So sorry, the connection to the server has gone down.");
  };

  public.emitMessage = function() {
    //fill in later
    return;
  };

  chatCtrl.activate(public);
  chatCtrl.echo("the controller is hooked up properly");

  return public;
});
