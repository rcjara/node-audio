//Top level methods
var echo = function(text) {
  $('#messages').append($('<p>' + text + '</p>'));
};

require.config({
  paths: {
    instrument:    'instrument'
  , interact:      'interact'
  , keyboard:      'keyboard'
  , keyboardSynth: 'keyboardSynth'
  , note:          'note'
  , sound:         'sound'
  , synthesizer:   'synthesizer'
  , modernizr:     'vendor/modernizr-2.6.2.min'
  , socket:        '/socket.io/socket.io'
  }
});

requirejs([  'socket'
           , 'interact'
           , 'keyboardSynth'
          ], function(io, interact, keyboard) { //, interact) {
  console.log('require ready');

  $(document).ready(function() {
    console.log("Document Ready");
    interact.addAlertee(keyboard);
    interact.connectToServer();
  });
});

