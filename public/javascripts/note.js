define(['./sound.js'], function(sound) {
  var DEFAULT_ATTR = {
        targetVolume: 0.3
      , attack: 0.1
      , release: 0.2
      };

  var ZERO = 0.00001;

  /* Convenience vars
   * (these should never change)
   */
  var ctx  = sound.getCtx()
    , dest = sound.getDest()
    , now  = function() { return ctx.currentTime; }
    ;

  function Note(freq, attr) {
    this.attr = {};

    //overwrite defaults with optional attributes
    for (var prop in DEFAULT_ATTR) {
      this.attr[prop] = DEFAULT_ATTR[prop];
    }

    if (attr) {
      for (var prop in attr) {
        this.attr[prop] = attr[prop];
      }
    }

    this.frequency = freq;
    this.playing = false;

  };


  Note.prototype.play = function() {
    if (this.playing) { return; }

    this.setupGainNode();
    this.setupSource();
    this.rampUpGain();

    this.playing = true;
  };

  Note.prototype.stop = function() {
    if (!this.playing) { return; }

    var endTime = now() + this.attr.release
      , gain    = this.gainNode.gain
      , curGain = gain.value

    gain.cancelScheduledValues( now() );
    gain.setValueAtTime(curGain, now() );
    gain.exponentialRampToValueAtTime(ZERO, endTime);


    var target = this;
    var killNoteFn = function() {
      target.source.noteOff(0);
    };
    setTimeout(killNoteFn, this.attr.release * 1000 + 10);
  }

  Note.prototype.setupSource = function() {
    var gainNode = this.gainNode
      , source = ctx.createOscillator()
      ;

    this.source = source;

    source.connect(gainNode);
    source.frequency.value = this.frequency;
    source.noteOn( now() );
  };

  Note.prototype.rampUpGain = function() {
    var endTime = now() + this.attr.attack
      , targetVolume = this.attr.targetVolume
      ;

    var gain = this.gainNode.gain;
    gain.value = ZERO;
    gain.setValueAtTime(ZERO, now() );
    gain.linearRampToValueAtTime(targetVolume, endTime);
  };

  Note.prototype.setupGainNode = function() {
    var gainNode = ctx.createGainNode();
    this.gainNode = gainNode;
    gainNode.connect(dest);
  };

  return Note;
});
