define(['sound', 'note'], function(sound, Note) {
  var public = {}
    , instruments = {}
    , ctx = sound.getCtx()
    ;

  function Generic() {};

  Generic.prototype.killNote = function(name) {
    if (this.notes[name]) { this.notes[name].stop(); }
  }

  Generic.prototype.start = function(name, freq) {
    console.log(this);
    this.killNote(name);

    var note = new Note(freq, this.attr, this.dest);
    this.notes[name] = note;
    note.play();
  };

  Generic.prototype.stop = function(name) {
    console.log(this);
    this.killNote(name);
    delete this.notes[name];
  };

  Generic.prototype.destroy = function() {
    console.log(this);
    $.each(this.notes, function(noteName, note) {
      note.stop();
    });
  };

  function Organ() {
    this.attr = {
      targetVolume: 0.3
    , attack: 0.2
    , release: 0.2
    };

    this.notes = {};
    this.dest = sound.getDest();
  };


  function SlowOrgan() {
    this.attr = {
      targetVolume: 0.3
    , attack: 0.2
    , release: 5.0
    };

    this.notes = {};
    this.dest = sound.getDest();
  }

  $.each([Organ, SlowOrgan], function(i, klass) {
    klass.prototype = Generic.prototype;
  });

  public.organ = Organ;
  public.slowOrgan = SlowOrgan;

  console.log("Public object off of instrument.js");
  console.log(public);

  return public;
});
