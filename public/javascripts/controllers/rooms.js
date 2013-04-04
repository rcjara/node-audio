//This is the first controller to be loaded, so only
//need to load these global variables once
define(  ['handlebars', 'templates'],
  function(__,  ___) {
  var public = {}
    , gateway
    , $welcome
    ;

  var initialize = function() {
    return public;
  };

  public.activate = function(_gateway) {
    gateway = _gateway;

    loadWelcome();
  };


  var loadWelcome = function() {
    var html = Handlebars.templates['welcome']();
    $welcome = $(html);

    $welcome.find('#first-available').click(function(e) {
      e.preventDefault();

      $welcome.fadeOut(function() { gateway.connectToServer(); });
    });

    $welcome.find('#local').click(function(e) {
      e.preventDefault();

      $welcome.fadeOut(function() { gateway.connectLocally(); });
    });

    $(document.body).prepend($welcome);
    $welcome.fadeIn();
  };

  return initialize();
});

