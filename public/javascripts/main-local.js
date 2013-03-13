require.config({
  paths: {
    roomInter:      'server-interaction/room'
  , mixerInter:     'server-interaction/mixer'
  , messagesInter:  'server-interaction/messages'
  , mockSocket:     'server-interaction/mock-socket'
  , imgPreloader:   'image-pre-loader'
  , instruments:    'audio/instruments'
  , mixer:          'audio/mixer'
  , note:           'audio/note'
  , sound:          'audio/web-audio-wrapper'
  , instCtrl:       'user-interface/instruments-controller'
  , chatCtrl:       'user-interface/chat-controller'
  , keyboard:       'user-interface/keyboard'
  , pianoKeys:      'user-interface/piano-keyboard'
  , keyboardInputs: 'user-interface/instrument-input-catalogue'
  , socket:         '/socket.io/socket.io'
  }
});

requirejs(['roomInter',  'mixerInter',  'messagesInter',  'instCtrl', 'chatCtrl' ],
   function(roomInter,    mixerInter,    messagesInter,    instCtrl ,  chatCtrl) {
  console.log('require ready');

  $(document).ready(function() {
    console.log("Document Ready");
    mixerInter.setUserSoundInputController(instCtrl);

    roomInter.subscribe(mixerInter);
    roomInter.subscribe(messagesInter);

    roomInter.connectLocally();
  });
});


