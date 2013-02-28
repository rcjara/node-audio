define(  ['keyboard', 'interact', 'keyboardInputs', 'pianoKeys'],
  function(keyboard,   interact,   KeyboardInputs,   pianoKeys) {
  //keyboard key code, note identifier, frequency
  var public = {}
    , CONTROLS_ID = '#controls'
    , curInstrument = 'slowOrgan'
    , keys
    ;

  public.activate = function() {
    createPlayArea();
    createInstrumentsSelector();
    updateInputKeys();
    $('#play-area').focus();

    interact.emitSynthEvent("addInstrument", curInstrument);
    interact.echo("You can start making music now.");
  };

  public.deactivate = function() {
    $('#instrument-selector').remove();
    pianoKeys.destroy();
  };

  public.keydown = function(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) {
      return;
    }
    var key = String.fromCharCode(e.which).toLowerCase();
    if (keys[key] !== undefined) {
      if (!keyboard.isPushed(key)) {
        interact.emitSynthEvent("start", "organ", keys[key]);
        keyboard.push(key);
        $.each(keys[key], function(i, noteName) {
          pianoKeys.pressKey(noteName);
        });
      }
    }
  };

  public.keyup = function(e) {
    var key = String.fromCharCode(e.which).toLowerCase();
    if (keys[key] !== undefined) {
      if (keyboard.isPushed(key)) {
        interact.emitSynthEvent("stop", "organ", keys[key]);
        keyboard.release(key);
        $.each(keys[key], function(i, noteName) {
          pianoKeys.releaseKey(noteName);
        });
      }
    }
  };

  var createPianoKeys = function() {
    pianoKeys.initialize();
    $.each(keys, function(key, noteArray) {
      if (noteArray.length == 1) {
        var noteName = noteArray[0];
        pianoKeys.addLabel(key, noteName);
      }
    });
  };

  var code = function(str) {
    return str.charCodeAt(0);
  };

  var createPlayArea = function() {
    var $playArea = $('<div id="play-area">');
    $playArea.attr('tabindex', -1);

    $playArea.focusin(function(e) {
      $playArea.html('<h1>Now Playing</h1><p>(the keyboard is hooked up to the synthesizer)</p>');
      $playArea.removeClass('redBG');
      $playArea.addClass('greenBG');
      activateKeyBoardEvents();
    });

    $playArea.focusout(function(e) {
      $playArea.html('<h1>Not Playing</h1><p>(click here to resume playing)</p>');
      $playArea.removeClass('greenBG');
      $playArea.addClass('redBG');
      deactivateKeyBoardEvents();
    });

    $(CONTROLS_ID).append($playArea);
  };

  var createInstrumentsSelector = function() {
    var $selector = $('<select id="instrument-selector">');
    $.each(KeyboardInputs, function(ident, record) {
      var $option = $('<option value="' + ident + '">' + record.fullName + '</option>');

      if (ident === curInstrument) {
        $option.attr('selected', 'selected');
      }

      $selector.append($option);
    });

    $selector.change( function(e) {
      $selector.children(':selected').each(function () {
        var newInstrument = $(this).attr('value');

        emitInstrumentChangeEvent('remove');
        curInstrument = newInstrument;
        emitInstrumentChangeEvent('add');

        updateInputKeys();

        $selector.blur();
      });
    });

    $(CONTROLS_ID).append($selector);
  };

  var emitInstrumentChangeEvent = function(eventType) {
    //valid eventTypes are: 'add', 'remove'
    var fullCommand = eventType + 'Instrument';

    interact.emitSynthEvent(fullCommand, KeyboardInputs[curInstrument].mixerID);
  };

  var updateInputKeys = function() {
    keys = KeyboardInputs[curInstrument].keys;
  };

  var activateKeyBoardEvents = function() {
    $('#play-area').keydown(function(e) {
      public.keydown(e);
    });

    $('#play-area').keyup(function(e) {
      public.keyup(e);
    });

    createPianoKeys();
  };

  var deactivateKeyBoardEvents = function() {
    $('#play-area').off('keydown', 'keyup');
    pianoKeys.destroy();
  };

  return public;
});
