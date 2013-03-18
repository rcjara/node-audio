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

    msgCtrl.echo(msg.text);

    room.on('message', function(msg) {
      var display;

      if (typeof msg.userName !== 'undefined') {
        display = msg.userName + ': ' + msg.text;
      } else {
        display = msg.text;
      }
      msgCtrl.echo(display);

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
