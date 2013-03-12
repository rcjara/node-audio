define(['mixer'], function(synth) {
  var public = {}
    , _this = this
    ;

  public.subscribe = function(alertee) {
    alertee.activate(_this);
  };

  public.emitSynthEvent = function(type, instrument, note) {
    var e = {};

    if (type === 'addInstrument') {
      synth[type]("local", instrument);
    } else {
      synth[type]("local", note);
    }
  };

  return public;
});


