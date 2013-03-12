define(['mixer'], function(mixer) {
  var public = {}
    ;

  public.subscribe = function(subscriber) {
    subscriber.activate(public);
  };

  public.emitSynthEvent = function(type, instrument, note) {
    var e = {};

    if (type === 'addInstrument') {
      mixer[type]("local", instrument);
    } else {
      mixer[type]("local", note);
    }
  };

  return public;
});


