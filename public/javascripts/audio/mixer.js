define(['instruments'], function(Instruments) {
  var public = {}
    , notesHash = {}
    , instruments = {}
    ;

  var notesArray = [
    { name: "A0",  freq: 27.5000 }
  , { name: "A#0", freq: 29.1352 }
  , { name: "B0",  freq: 30.8677 }
  , { name: "C1",  freq: 32.7032 }
  , { name: "C#1", freq: 34.6478 }
  , { name: "D1",  freq: 36.7081 }
  , { name: "D#1", freq: 38.8909 }
  , { name: "E1",  freq: 41.2034 }
  , { name: "F1",  freq: 43.6535 }
  , { name: "F#1", freq: 46.2493 }
  , { name: "G1",  freq: 48.9994 }
  , { name: "G#1", freq: 51.9131 }
  , { name: "A1",  freq: 55.0000 }
  , { name: "A#1", freq: 58.2705 }
  , { name: "B1",  freq: 61.7354 }
  , { name: "C2",  freq: 65.4064 }
  , { name: "C#2", freq: 69.2957 }
  , { name: "D2",  freq: 73.4162 }
  , { name: "D#2", freq: 77.7817 }
  , { name: "E2",  freq: 82.4069 }
  , { name: "F2",  freq: 87.3071 }
  , { name: "F#2", freq: 92.4986 }
  , { name: "G2",  freq: 97.9989 }
  , { name: "G#2", freq: 103.826 }
  , { name: "A2",  freq: 110.000 }
  , { name: "A#2", freq: 116.541 }
  , { name: "B2",  freq: 123.471 }
  , { name: "C3",  freq: 130.813 }
  , { name: "C#3", freq: 138.591 }
  , { name: "D3",  freq: 146.832 }
  , { name: "D#3", freq: 155.563 }
  , { name: "E3",  freq: 164.814 }
  , { name: "F3",  freq: 174.614 }
  , { name: "F#3", freq: 184.997 }
  , { name: "G3",  freq: 195.998 }
  , { name: "G#3", freq: 207.652 }
  , { name: "A3",  freq: 220.000 }
  , { name: "A#3", freq: 233.082 }
  , { name: "B3",  freq: 246.942 }
  , { name: "C4",  freq: 261.626 }
  , { name: "C#4", freq: 277.183 }
  , { name: "D4",  freq: 293.665 }
  , { name: "D#4", freq: 311.127 }
  , { name: "E4",  freq: 329.628 }
  , { name: "F4",  freq: 349.228 }
  , { name: "F#4", freq: 369.994 }
  , { name: "G4",  freq: 391.995 }
  , { name: "G#4", freq: 415.305 }
  , { name: "A4",  freq: 440.000 }
  , { name: "A#4", freq: 466.164 }
  , { name: "B4",  freq: 493.883 }
  , { name: "C5",  freq: 523.251 }
  , { name: "C#5", freq: 554.365 }
  , { name: "D5",  freq: 587.330 }
  , { name: "D#5", freq: 622.254 }
  , { name: "E5",  freq: 659.255 }
  , { name: "F5",  freq: 698.456 }
  , { name: "F#5", freq: 739.989 }
  , { name: "G5",  freq: 783.991 }
  , { name: "G#5", freq: 830.609 }
  , { name: "A5",  freq: 880.000 }
  , { name: "A#5", freq: 932.328 }
  , { name: "B5",  freq: 987.767 }
  , { name: "C6",  freq: 1046.50 }
  , { name: "C#6", freq: 1108.73 }
  , { name: "D6",  freq: 1174.66 }
  , { name: "D#6", freq: 1244.51 }
  , { name: "E6",  freq: 1318.51 }
  , { name: "F6",  freq: 1396.91 }
  , { name: "F#6", freq: 1479.98 }
  , { name: "G6",  freq: 1567.98 }
  , { name: "G#6", freq: 1661.22 }
  , { name: "A6",  freq: 1760.00 }
  , { name: "A#6", freq: 1864.66 }
  , { name: "B6",  freq: 1975.53 }
  , { name: "C7",  freq: 2093.00 }
  , { name: "C#7", freq: 2217.46 }
  , { name: "D7",  freq: 2349.32 }
  , { name: "D#7", freq: 2489.02 }
  , { name: "E7",  freq: 2637.02 }
  , { name: "F7",  freq: 2793.83 }
  , { name: "F#7", freq: 2959.96 }
  , { name: "G7",  freq: 3135.96 }
  , { name: "G#7", freq: 3322.44 }
  , { name: "A7",  freq: 3520.00 }
  , { name: "A#7", freq: 3729.31 }
  , { name: "B7",  freq: 3951.07 }
  , { name: "C8",  freq: 4186.01 }
  ];

  var createNotesHash = function() {
    $.each(notesArray, function(i, item) {
      notesHash[item.name] = item.freq;
    });
  };


  public.start = function(ident, notes) {
    $.each(notes, function(i, noteName) {
      instruments[ident].start(noteName, notesHash[noteName]);
    });
  };

  public.stop = function(ident, notes) {
    $.each(notes, function(i, noteName) {
      instruments[ident].stop(noteName);
    });
  };

  public.addInstrument = function(ident, name) {
    if (instruments[ident] !== undefined) {
      console.log("Instrument id: " + ident + " already existed.");
      public.removeInstrument(name);
    }

    console.log("Creating instrument id: " + ident + " name: " + name);
    instruments[ident] = new Instruments[name];
  };

  public.addInstruments = function(instruments) {
    console.log("Adding instruments");
    $.each(instruments, function(i, obj) {
      console.log(obj);
      public.addInstrument(obj.ident, obj.name);
    });
  };

  public.removeInstrument = function(ident) {
    instruments[ident].destroy();
    delete instruments[ident];
  }

  createNotesHash();
  return public;
});
