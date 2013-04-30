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

  Generic.prototype.killNote = function(name, time) {
    if (this.notes[name]) { this.notes[name].stop(time); }
  }

  Generic.prototype.start = function(name, freq, time) {
    this.killNote(name);

    var note = new Note(freq, this.attr, this.dest);
    this.notes[name] = note;
    note.play(time);
  };

  Generic.prototype.stop = function(name, time) {
    this.killNote(name, time);
    delete this.notes[name];
  };

  Generic.prototype.destroy = function() {
    $.each(this.notes, function(noteName, note) {
      note.stop();
    });
  };

  Generic.prototype.pulse = function(name, freq, time) {
    var note = this.notes[name];

    if (!note) {
      note = new Note(freq, this.attr, this.dest);
      this.notes[name] = note;
    }

    note.pulse();
  }

  /* Specific instruments */
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

  function Metronome() {
    this.attr = {
      targetVolume: 0.1
    , attack: 0.05
    , release: 0.1
    , waveFrom: WAVE_FORMS['sine']
    };

    this.notes = {};
    this.dest = Sound.newDestination();
  }

  var classes = [Organ, SlowOrgan, SawTooth, Square, Triangle, Metronome];
  $.each(classes, function(i, klass) {
    klass.prototype.__proto__ = Generic.prototype;
  });


  public.organ = Organ;
  public.slowOrgan = SlowOrgan;
  public.sawTooth = SawTooth;
  public.square = Square;
  public.triangle = Triangle;
  public.metronome = Metronome;

  return initialize();
});
