require.config({
  paths: {
    roomGtwy:       'gateways/room'
  , mixerGtwy:      'gateways/mixer'
  , messagesGtwy:   'gateways/messages'
  , mockServer:     'gateways/mock-server'
  , imgPreloader:   'image-pre-loader'
  , instruments:    'audio/instruments'
  , mixer:          'audio/mixer'
  , note:           'audio/note'
  , sound:          'audio/web-audio-wrapper'
  , instCtrl:       'user-interface/instruments-controller'
  , msgCtrl:        'user-interface/message-controller'
  , keyboard:       'user-interface/keyboard'
  , pianoKeys:      'user-interface/piano-keyboard'
  , keyboardInputs: 'user-interface/instrument-input-catalogue'
  , socket:         '/socket.io/socket.io'
  }
});

requirejs(['roomGtwy',  'mixerGtwy',  'messagesGtwy',  'instCtrl', 'msgCtrl' ],
   function(roomGtwy,    mixerGtwy,    messagesGtwy,    instCtrl ,  msgCtrl) {
  console.log('require ready');

  $(document).ready(function() {
    console.log("Document Ready");
    mixerGtwy.setUserSoundInputController(instCtrl);

    roomGtwy.subscribe(mixerGtwy);
    roomGtwy.subscribe(messagesGtwy);

    roomGtwy.connectToServer();
  });
});

