//Top level methods
var echo = function(text) {
  $('#messages').append($('<p>' + text + '</p>'));
};

require.config({
  paths: {
    interact:      'interact'
  , instruments:   'audio/instruments'
  , mixer:         'audio/mixer'
  , note:          'audio/note'
  , sound:         'audio/web-audio-wrapper'
  , controller:    'user-interface/app-controller'
  , keyboard:      'user-interface/keyboard'
  , socket:        '/socket.io/socket.io'
  }
});

requirejs([  'socket'
           , 'interact'
           , 'controller'
          ], function(io, interact, controller) { //, interact) {
  console.log('require ready');

  $(document).ready(function() {
    console.log("Document Ready");
    interact.addAlertee(controller);
    interact.connectToServer();
  });
});

