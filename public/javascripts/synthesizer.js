var notesArray;
var notesHash = {};

define(['./note.js'], function(Note) {
  var public = {}
    //, notesHash = {}
    , instruments = {}
    ;

  notesArray = [
    { name: "A3",  freq: 220.000 }
  , { name: "B3",  freq: 246.942 }
  , { name: "C#4", freq: 277.183 }
  , { name: "E4",  freq: 329.628 }
  , { name: "F#4", freq: 369.994 }
  , { name: "A4",  freq: 440.000 }
  , { name: "B4",  freq: 493.883 }
  , { name: "C#5", freq: 554.365 }
  , { name: "E5",  freq: 659.255 }
  , { name: "F#5", freq: 739.989 }
  , { name: "A5",  freq: 880.000 }
  , { name: "B5",  freq: 987.767 }
  , { name: "C#6", freq: 1108.73 }
  , { name: "E6",  freq: 1318.51 }
  , { name: "F#6", freq: 1479.98 }
  ];

  var createNotesHash = function() {
    $.each(notesArray, function(i, item) {
      notesHash[item.name] = item.freq;
    });
  };


  public.start = function(instrument, notes) {
    $.each(notes, function(i, noteName) {
      var freq = notesHash[noteName]
        , note = new Note(freq)
        ;

      if (instruments[instrument][noteName]) {
        instruments[instrument][noteName].stop();
      }
      instruments[instrument][noteName] = note;
      note.play();
    });
  };

  public.stop = function(instrument, notes) {
    $.each(notes, function(i, noteName) {
      var note = instruments[instrument][noteName];
      note.stop();
      instruments[instrument][noteName] = null;
    });
  };

  public.addInstrument = function(name) {
    if (instruments[name] !== undefined) {
      console.log("Instrument named: " + name + " already existed.");
      public.removeInstrument(name);
    }
    instruments[name] = {};
  };

  public.addInstruments = function(names) {
    $.each(names, function(i, name) { public.addInstrument(name); });
  };

  public.removeInstrument = function(name) {
    console.log("Removing instrument named: " + name + " .");
    $.each(instruments[name], function(noteName, note) {
      note.stop();
    });

    instruments[name] = null;
  }

  createNotesHash();
  return public;
});
