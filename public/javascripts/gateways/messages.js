define(['msgCtrl'], function(msgCtrl) {
  var public = {}
    , room
    ;

  var initialize = function() {
    msgCtrl.activate(public);
    msgCtrl.echo("the controller is hooked up properly");
    return public;
  };

  public.connection = function() {
    msgCtrl.echo("Connecting to the server...");
  };

  public.authorization = function() {
    msgCtrl.echo("The server has responded...");
  };

  public.newRoom = function(_room, msg) {
    room = _room;

    msgCtrl.echo(msg);

    room.on('message', function(msg) {
      msgCtrl.echo(msg);

      if (typeof msg.toLog !== 'undefined') {
        console.log(msg.toLog);
      }
    });
  };

  public.disconnection = function() {
    msgCtrl.echo("So sorry, the connection to the server has gone down.");
  };

  public.emitMessage = function(text) {
    var e = { text: text };
    room.emit('chat-event', e);
  };

  return initialize();
});
