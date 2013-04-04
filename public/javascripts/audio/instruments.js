define(['sound', 'note'], function(Sound, note) {
  var WAVE_FORMS = {
    'sine': 0
  , 'square': 1
  , 'sawtooth': 2
  , 'triangle': 3
  };

  var public = {}
    , instruments = {}
    , ctx = Sound.getCtx()
    , Note
    ;

  var initialize = function() {
    note.setContext(ctx);
    Note = note.klass;
    return public;
  }

  function Generic() {};

  Generic.prototype.killNote = function(name) {
    if (this.notes[name]) { this.notes[name].stop(); }
  }

  Generic.prototype.start = function(name, freq) {
    this.killNote(name);

    var note = new Note(freq, this.attr, this.dest);
    this.notes[name] = note;
    note.play();
  };

  Generic.prototype.stop = function(name) {
    this.killNote(name);
    delete this.notes[name];
  };

  Generic.prototype.destroy = function() {
    $.each(this.notes, function(noteName, note) {
      note.stop();
    });
  };

  function Organ() {
    this.attr = {
      targetVolume: 0.3
    , attack: 0.2
    , release: 0.2
    , waveForm: WAVE_FORMS['sine']
    };

    this.notes = {};
    this.dest = Sound.getDest();
  };


  function SlowOrgan() {
    this.attr = {
      targetVolume: 0.3
    , attack: 0.2
    , release: 5.0
    , waveForm: WAVE_FORMS['sine']
    };

    this.notes = {};
    this.dest = Sound.getDest();
  }

  function SawTooth() {
    this.attr = {
      targetVolume: 0.3
    , attack: 0.2
    , release: 0.2
    , waveForm: WAVE_FORMS['sawtooth']
    };

    this.notes = {};
    this.dest = Sound.getDest();
  }

  function Square() {
    this.attr = {
      targetVolume: 0.3
    , attack: 0.2
    , release: 0.2
    , waveForm: WAVE_FORMS['square']
    };

    this.notes = {};
    this.dest = Sound.getDest();
  }

  function Triangle() {
    this.attr = {
      targetVolume: 0.3
    , attack: 0.2
    , release: 0.2
    , waveForm: WAVE_FORMS['triangle']
    };

    this.notes = {};
    this.dest = Sound.getDest();

  }

  $.each([Organ, SlowOrgan, SawTooth, Square, Triangle], function(i, klass) {
    klass.prototype.__proto__ = Generic.prototype;
  });


  public.organ = Organ;
  public.slowOrgan = SlowOrgan;
  public.sawTooth = SawTooth;
  public.square = Square;
  public.triangle = Triangle;

  return initialize();
});
