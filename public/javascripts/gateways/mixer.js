define(['mixer', 'metronome'], function(mixer, metronome) {
  var public = {}
    , userSoundInputController
    , clientID
    , room
    ;

  public.setUserSoundInputController = function(_userSoundInputController) {
    userSoundInputController = _userSoundInputController;
  }

  public.newRoom = function(_room) {
    room = _room;

    setUpListeners();
    setUpMetronome();
    userSoundInputController.activate(public);
  };

  public.disconnection = function() {
    userSoundInputController.deactivate();
  };

  public.emitSynthEvent = function(type, instrumentName, noteName) {
    var e = { type:           type
            , instrumentName: instrumentName
            , noteName:       noteName };

    room.emit('synth-event', e);
  };

  var setUpMetronome = function() {
    mixer.addInstrument('metronome', 'metronome');
    metronome.setBeatCB(function() {
      mixer.pulse('metronome', ['C8']);
    });
    metronome.start();
  };


  var setUpListeners = function() {
    room.on('synth-event', function(e) {
      // This play-area crap needs to be moved out of this
      // otherwise non-dom interacting class
      if (e.type === 'start') {
        $('#play-area').removeClass('beat-pulse-run');
        setTimeout(function() {
          $('#play-area').addClass('beat-pulse-run');
        }, 10);
      }

      if (e.type === 'addInstrument') {
        mixer[e.type](e.clientID, e.instrumentName);
      } else {
        mixer[e.type](e.clientID, e.noteName);
      }
    });

    room.on('add-instruments', function(e) {
      mixer.addInstruments(e.instruments);
    });
  };

  return public;
});
