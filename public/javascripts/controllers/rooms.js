//This is the first controller to be loaded, so only
//need to load these global variables once
define(  ['handlebars', 'templates'],
  function(__,  ___) {
  var public = {}
    , gateway
    , $welcome
    , $namePrompt
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

      $welcome.fadeOut(function() { loadNamePrompt(); });
    });

    $welcome.find('#local').click(function(e) {
      e.preventDefault();

      $welcome.fadeOut(function() { gateway.connectLocally(); });
    });

    $(document.body).prepend($welcome);
    $welcome.fadeIn();
  };

  var loadNamePrompt = function() {
    var html = Handlebars.templates['name-prompt']();
    $namePrompt = $(html);

    var $nameField = $namePrompt.find('#field');
    var $submit    = $namePrompt.find('#submit');

    $submit.click(function(e) {
      e.preventDefault();

      if ($nameField.val() === '') { return; }

      gateway.setUserName( $nameField.val() );

      $namePrompt.fadeOut( function() { gateway.connectToServer(); } );
    });

    $(document.body).prepend($namePrompt);
    $namePrompt.fadeIn();
  };

  return initialize();
});

