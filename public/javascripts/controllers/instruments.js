define(  [ 'keyboard', 'keyboardInputs', 'pianoKeys'],
  function( keyboard,   KeyboardInputs,   pianoKeys) {
//define(  [ 'keyboard', 'keyboardInputs', 'pianoKeys','Handlebars'],
//  function( keyboard,   KeyboardInputs,   pianoKeys,   Handlebars) {
  //keyboard key code, note identifier, frequency
  var public = {}
    , gateway
    , $controls
    , $playArea
    , $selector
    , curInstrument = 'slowOrgan'
    , keys
    ;

  public.activate = function(_gateway) {
    gateway = _gateway;

    loadTemplate();
    bindEvergreenEvents();
    updateInputKeys();
    $playArea.focus();

    gateway.emitSynthEvent("addInstrument", curInstrument);
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
        gateway.emitSynthEvent("start", KeyboardInputs[curInstrument].mixerID, keys[key]);
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
        gateway.emitSynthEvent("stop", KeyboardInputs[curInstrument].mixerID, keys[key]);
        keyboard.release(key);
        $.each(keys[key], function(i, noteName) {
          pianoKeys.releaseKey(noteName);
        });
      }
    }
  };

  var loadTemplate = function() {
    ctx = { instruments: KeyboardInputs };
    html = Handlebars.templates['instrument-controls'](ctx);

    $controls = $(html);
    $playArea = $controls.find('#play-area');
    $selector = $controls.find('#instrument-selector');

    $('#right').append($controls);
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

  var bindEvergreenEvents = function() {
    //playArea events
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

    //selector events
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
  };

  var emitInstrumentChangeEvent = function(eventType) {
    //valid eventTypes are: 'add', 'remove'
    var fullCommand = eventType + 'Instrument';

    gateway.emitSynthEvent(fullCommand, KeyboardInputs[curInstrument].mixerID);
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
