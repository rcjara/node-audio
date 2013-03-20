define([], function() {
  var ALL_NOTES = [ "A0", "A#0", "B0", "C1", "C#1", "D1"
                  , "D#1", "E1", "F1", "F#1", "G1", "G#1"
                  , "A1", "A#1", "B1", "C2", "C#2", "D2"
                  , "D#2", "E2", "F2", "F#2", "G2", "G#2"
                  , "A2", "A#2", "B2", "C3", "C#3", "D3"
                  , "D#3", "E3", "F3", "F#3", "G3", "G#3"
                  , "A3", "A#3", "B3", "C4", "C#4", "D4"
                  , "D#4", "E4", "F4", "F#4", "G4", "G#4"
                  , "A4", "A#4", "B4", "C5", "C#5", "D5"
                  , "D#5", "E5", "F5", "F#5", "G5", "G#5"
                  , "A5", "A#5", "B5", "C6", "C#6", "D6"
                  , "D#6", "E6", "F6", "F#6", "G6", "G#6"
                  , "A6", "A#6", "B6", "C7", "C#7", "D7"
                  , "D#7", "E7", "F7", "F#7", "G7", "G#7"
                  , "A7", "A#7", "B7", "C8" ]

  var PENTATONIC_SCALE = [2, 2, 3, 2, 3];
  var MAJOR_SCALE = [2, 2, 2, 1, 2, 2, 2, 1];
  var MAJ_CHORD = [0, 4, 3, 5];
  var MIN_CHORD = [0, 3, 4, 5];
  var DIM_CHORD = [0, 3, 3];
  var MAJvii_CHORD = [0, 4, 3, 3];
  var MINvii_CHORD = [0, 3, 4, 3];
  var DIMvii_CHORD = [0, 3, 3, 3];

  var STANDARD_KEYS = [ 'z', 'x', 'c', 'v', 'b'
                      , 'a', 's', 'd', 'f', 'g'
                      , 'q', 'w', 'e', 'r', 't' ];

  var indexOfNote = function(noteName) {
    return ALL_NOTES.indexOf(noteName);
  };

  var buildChordOff = function(noteName, chordType) {
    var noteIndex = indexOfNote(noteName)
        chord = [];

    for (var i = 0; i < chordType.length; i++) {
      noteIndex += chordType[i];
      chord.push(ALL_NOTES[noteIndex]);
    }

    return chord;
  };

  var buildKeyMap = function(base, scale, keys) {
    var noteIndex = indexOfNote(base)
      , keyMap = {}
      ;

    for (var i = 0; i < keys.length; i++) {
      keyMap[ keys[i] ] = [ ALL_NOTES[noteIndex] ];
      noteIndex += scale[ i % scale.length ];
    }

    return keyMap;
  };

  var DEFAULT_KEY_MAP = buildKeyMap('C3', PENTATONIC_SCALE, STANDARD_KEYS);

  var CHORD_KEY_MAP = {
    z: buildChordOff('C3', MAJ_CHORD)
  , x: buildChordOff('D3', MIN_CHORD)
  , c: buildChordOff('F3', MAJ_CHORD)
  , v: buildChordOff('G3', MAJ_CHORD)
  , b: buildChordOff('A3', MIN_CHORD)
  , n: buildChordOff('B3', DIM_CHORD)
  , a: buildChordOff('C4', MAJ_CHORD)
  , s: buildChordOff('D4', MIN_CHORD)
  , d: buildChordOff('F4', MAJ_CHORD)
  , f: buildChordOff('G4', MAJ_CHORD)
  , g: buildChordOff('A4', MIN_CHORD)
  , h: buildChordOff('B4', DIM_CHORD)
  , q: buildChordOff('C4', MAJvii_CHORD)
  , w: buildChordOff('D4', MINvii_CHORD)
  , e: buildChordOff('F4', MAJvii_CHORD)
  , r: buildChordOff('G4', MAJvii_CHORD)
  , t: buildChordOff('A4', MINvii_CHORD)
  , y: buildChordOff('B4', DIMvii_CHORD)
  };

  var AVAILABLE_INSTRUMENTS = {
    slowOrgan:
      { mixerID: 'slowOrgan'
      , fullName: 'Reverbrating Organ'
      , keys: DEFAULT_KEY_MAP }
    , organ:
      { mixerID: 'organ'
      , fullName: 'Organ'
      , keys: DEFAULT_KEY_MAP }
    , rhythmOrgan:
      { mixerID: 'organ'
      , fullName: 'Rhythm Organ'
      , keys: CHORD_KEY_MAP }
    , sawTooth:
      { mixerID: 'sawTooth'
      , fullName: 'Saw Tooth Whatever'
      , keys: DEFAULT_KEY_MAP }
    , triangle:
      { mixerID: 'triangle'
      , fullName: 'Triangle Whatever'
      , keys: DEFAULT_KEY_MAP }
    , square:
      { mixerID: 'square'
      , fullName: 'Square Whatever'
      , keys: DEFAULT_KEY_MAP }
    };

  $.each(AVAILABLE_INSTRUMENTS, function(ident, record) {
    record.ident = ident;
  });

  return AVAILABLE_INSTRUMENTS;
});



