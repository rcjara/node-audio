//Top level methods
var echo = function(text) {
  $('body').append($('<p>' + text + '</p>'));
};

require([  'socket.io/socket.io.js'
         , './javascripts/interact.js'
         , './javascripts/keyboardSynth.js'
        ], function(io, interact, keyboard) { //, interact) {
  console.log('require ready');

  $(document).ready(function() {
    console.log("Document Ready");
    interact.connectToServer(function() {
      keyboard.activate();
    });
  });
});

