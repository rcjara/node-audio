require.config({
  paths: {
    roomGtwy:       '/javascripts/gateways/room'
  , mixerGtwy:      '/javascripts/gateways/mixer'
  , messagesGtwy:   '/javascripts/gateways/messages'
  , mockServer:     '/javascripts/gateways/mock-server'
  , imgPreloader:   '/javascripts/image-pre-loader'
  , instruments:    '/javascripts/audio/instruments'
  , mixer:          '/javascripts/audio/mixer'
  , note:           '/javascripts/audio/note'
  , metronome:      '/javascripts/audio/metronome'
  , sound:          '/javascripts/audio/web-audio-wrapper'
  , instCtrl:       '/javascripts/controllers/instruments'
  , msgCtrl:        '/javascripts/controllers/messages'
  , roomsCtrl:      '/javascripts/controllers/rooms'
  , keyboard:       '/javascripts/user-interface/keyboard'
  , pianoKeys:      '/javascripts/user-interface/piano-keyboard'
  , keyboardInputs: '/javascripts/user-interface/instrument-input-catalogue'
  , templates:      '/javascripts/templates'
  , handlebars:     '/javascripts/vendor/handlebars'
  , socket:         '/socket.io/socket.io'
  },
  shim: {
    'handlebars': {
      exports: 'Handlebars'
    },
    'templates': {
      deps: ['handlebars']
    , exports: 'no_exports'
    }
  }
});

requirejs([ 'roomGtwy',  'mixerGtwy',  'messagesGtwy',  'roomsCtrl', 'instCtrl'],
   function( roomGtwy,    mixerGtwy,    messagesGtwy,    roomsCtrl,   instCtrl)  {
  console.log('require ready');

  $(document).ready(function() {
    console.log("Document Ready");
    mixerGtwy.setUserSoundInputController(instCtrl);

    roomGtwy.subscribe(mixerGtwy);
    roomGtwy.subscribe(messagesGtwy);

    roomsCtrl.activate(roomGtwy);
  });
});

