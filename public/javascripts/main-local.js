require.config({
  paths: {
    interact:       'interact'
  , localInteract:  'local-interact'
  , imgPreloader:   'image-pre-loader'
  , instruments:    'audio/instruments'
  , mixer:          'audio/mixer'
  , note:           'audio/note'
  , sound:          'audio/web-audio-wrapper'
  , controller:     'user-interface/instruments-controller'
  , keyboard:       'user-interface/keyboard'
  , pianoKeys:      'user-interface/piano-keyboard'
  , keyboardInputs: 'user-interface/instrument-input-catalogue'
  , socket:         '/socket.io/socket.io'
  }
});

requirejs(['localInteract' , 'controller'] ,
  function( interact,    controller) { //, interact) {
  console.log('require ready');

  $(document).ready(function() {
    console.log("Document Ready");
    interact.subscribe(controller);
  });
});


