define(['keyboard', 'interact'], function(keyboard, interact) {
  //keyboard key code, note identifier, frequency
  var public = {}
    , AVAILABLE_INSTRUMENTS = ['slowOrgan', 'organ']
    , CONTROLS_ID = '#controls'
    , curInstrument = 'slowOrgan'
    ;

  var code = function(str) {
    return str.charCodeAt(0);
  };

  var keys = {
    z: ['C3']
  , x: ['D3']
  , c: ['E3']
  , v: ['G3']
  , b: ['A3']
  , a: ['C4']
  , s: ['D4']
  , d: ['E4']
  , f: ['G4']
  , g: ['A4']
  , q: ['C5']
  , w: ['D5']
  , e: ['E5']
  , r: ['G5']
  , t: ['A5']
  , h: ['C4', 'E4', 'G4']
  };

  var playing = {};

  public.activate = function() {
    createPlayArea();
    createInstrumentsSelector();
    $('#play-area').focus();

    interact.emitSynthEvent("addInstrument", curInstrument);
    interact.echo("You can start making music now.");
  };

  public.deactivate = function() {
    $('#instrument-selector').remove();
  };

  public.keydown = function(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) {
      console.log('special key pressed');
      return;
    }
    var key = String.fromCharCode(e.which).toLowerCase();
    console.log('keydown: ' + key);
    if (keys[key] !== undefined) {
      if (!keyboard.isPushed(key)) {
        interact.emitSynthEvent("start", "organ", keys[key]);
        keyboard.push(key);
      }
    }
  };

  public.keyup = function(e) {
    var key = String.fromCharCode(e.which).toLowerCase();
    console.log('keyup: ' + key);
    if (keys[key] !== undefined) {
      if (keyboard.isPushed(key)) {
        interact.emitSynthEvent("stop", "organ", keys[key]);
        keyboard.release(key);
      }
    }
  };

  var activateKeyBoardEvents = function() {
    $('#play-area').keydown(function(e) {
      public.keydown(e);
    });

    $('#play-area').keyup(function(e) {
      public.keyup(e);
    });
  };

  var deactivateKeyBoardEvents = function() {
    $('#play-area').off('keydown', 'keyup');
  };

  var createPlayArea = function() {
    var $playArea = $('<div id="play-area">');
    $playArea.attr('tabindex', -1);

    $playArea.focusin(function(e) {
      console.log('focus in playarea');
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
    $.each(AVAILABLE_INSTRUMENTS, function(i, instrument) {
      var $option = $('<option value="' + instrument + '">' + instrument + '</option>');

      if (instrument === curInstrument) {
        $option.attr('selected', 'selected');
      }

      $selector.append($option);
    });

    $selector.change( function(e) {
      $selector.children(':selected').each(function () {
        var newInstrument = $(this).text();
        interact.emitSynthEvent('removeInstrument', curInstrument);
        curInstrument = newInstrument;
        interact.emitSynthEvent('addInstrument', curInstrument);

        $selector.blur();
      });
    });

    $(CONTROLS_ID).append($selector);
  };

  return public;
});
