define(['templates'], function(templates) {
  console.log("chat controller loading");
  var public = {}
    , gateway
    , $container
    , $input
    , $display
    ;

  var initialize = function() {
    loadTemplate();

    return public;
  };

  public.activate = function(_gateway) {
    gateway = _gateway;

    bindEvents();
  };

  public.deactivate = function() {
    destroyInput();
  };

  public.echo = function(text) {
    $display.append($('<p>' + text + '</p>'));
    scrollToBottom();
  };

  var loadTemplate = function() {
    html = Handlebars.templates['messages']();
    $container = $(html);
    $display = $container.find('#display');
    $input   = $container.find('#input');

    $('#left').append($container);
  };

  var bindEvents = function() {
    $container.bind('keypress', function(e) {
      var code = (e.keyCode ? e.keyCode : e.which);
      if(code == 13) { //Enter keycode
        e.preventDefault();

        var text = $input.val();
        console.log('the input value: ' + text);
        gateway.emitMessage(text);
        $input.val('');
      }
    });
  };

  var scrollToBottom = function() {
    console.log("scrolling: " + $display[0].scrollHeight);
    $display.scrollTop($display[0].scrollHeight);
  };


  var destroyInput = function() {
    $input.remove();
    $input = null;
  };


  return initialize();
});
