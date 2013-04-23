define(  [],
  function() {
//define(  ['Handlebars'],
//  function(Handlebars) {
  var public = {}
    , gateway
    , $container
    , $input
    , $display
    ;

  var initialize = function() {
    return public;
  };

  public.activate = function(_gateway) {
    gateway = _gateway;

    loadTemplate();
    bindEvents();
  };

  public.deactivate = function() {
    destroyInput();
  };

  public.echo = function(msg) {
    msg = ensureMsgFmt(msg);
    var html = Handlebars.templates['message'](msg);

    var $obj = $($.trim(html));
    $display.append($obj);
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
        gateway.emitMessage(text);
        $input.val('');
      }
    });
  };

  var scrollToBottom = function() {
    $display.scrollTop($display[0].scrollHeight);
  };


  var destroyInput = function() {
    $input.remove();
    $input = null;
  };

  var ensureMsgFmt = function(msg) {
    if (typeof msg === 'string') {
      return { text: msg };
    } else {
      return msg;
    }
  }


  return initialize();
});
