define([], function() {
  console.log("chat controller loading");
  var public = {}
    , gateway
    , $container
    , $input
    , $display
    ;

  var initialize = function() {
    $container = $('#chat');
    $display = $container.find('#display');
    return public;
  };

  public.activate = function(_gateway) {
    gateway = _gateway;

    createInput();
  };

  public.deactivate = function() {
    destroyInput();
  };

  public.echo = function(text) {
    $display.append($('<p>' + text + '</p>'));
  };

  var createInput  = function() {
    $input = $('<textarea />');
    $container.append($input);

    $container.bind('keypress', function(e) {
      var code = (e.keyCode ? e.keyCode : e.which);
      if(code == 13) { //Enter keycode
        e.preventDefault();

        var text = $input.val();
        gateway.emitMessage(text);
        $input.val('');
      }
    });
  };

  var destroyInput = function() {
    $input.remove();
    $input = null;
  };


  return initialize();
});
