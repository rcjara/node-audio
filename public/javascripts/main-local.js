require.config({
  paths: {
    localInteract:  'local-interact'
  , roomInter:      'server-interaction/room'
  , mixerInter:     'server-interaction/mixer'
  , messagesInter:  'server-interaction/messages'
  , imgPreloader:   'image-pre-loader'
  , instruments:    'audio/instruments'
  , mixer:          'audio/mixer'
  , note:           'audio/note'
  , sound:          'audio/web-audio-wrapper'
  , instController: 'user-interface/instruments-controller'
  , keyboard:       'user-interface/keyboard'
  , pianoKeys:      'user-interface/piano-keyboard'
  , keyboardInputs: 'user-interface/instrument-input-catalogue'
  , socket:         '/socket.io/socket.io'
  }
});

requirejs(['localInteract' , 'instController'] ,
  function( interact,         instController) { //, interact) {
  console.log('require ready');

  $(document).ready(function() {
    console.log("Document Ready");
    interact.subscribe(instController);
  });
});


