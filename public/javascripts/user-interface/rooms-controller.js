define([], function() {
  var public = {}
    , $userNameField
    ;

  var initialize = function() {
    $userNameField = $('#username');
    return public;
  };



  return initialize();
});

