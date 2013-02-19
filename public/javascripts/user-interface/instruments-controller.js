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

  var createInstrumentsSelector = function() {
    $selector = $('<select id="instrument-selector">');
    $.each(AVAILABLE_INSTRUMENTS, function(i, instrument) {
      $option = $('<option value="' + instrument + '">' + instrument + '</option>');

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

  public.keydown = function(keyCode) {
    var key = String.fromCharCode(keyCode).toLowerCase();
    console.log('keydown: ' + key);
    if (keys[key] !== undefined) {
      if (!keyboard.isPushed(key)) {
        interact.emitSynthEvent("start", "organ", keys[key]);
        keyboard.push(key);
      }
    }
  };

  public.keyup = function(keyCode) {
    var key = String.fromCharCode(keyCode).toLowerCase();
    console.log('keyup: ' + key);
    if (keys[key] !== undefined) {
      if (keyboard.isPushed(key)) {
        interact.emitSynthEvent("stop", "organ", keys[key]);
        keyboard.release(key);
      }
    }
  };

  public.activate = function() {
    $('body').keydown(function(e) {
      public.keydown(e.which);
    });

    $('body').keyup(function(e) {
      public.keyup(e.which);
    });

    createInstrumentsSelector();

    interact.emitSynthEvent("addInstrument", curInstrument);
    interact.echo("You can start making music now.");
  };

  public.deactivate = function() {
    $('body').off('keydown', 'keyup');
    $('#instrument-selector').remove();
  };

  return public;
});
