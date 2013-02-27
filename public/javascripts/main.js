require.config({
  paths: {
    interact:      'interact'
  , imgPreloader:  'image-pre-loader'
  , instruments:   'audio/instruments'
  , mixer:         'audio/mixer'
  , note:          'audio/note'
  , sound:         'audio/web-audio-wrapper'
  , controller:    'user-interface/instruments-controller'
  , keyboard:      'user-interface/keyboard'
  , pianoKeys:     'user-interface/piano-keyboard'
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

