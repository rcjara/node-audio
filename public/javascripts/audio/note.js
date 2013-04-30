define([], function() {
  var ZERO = 0.00001;

  /* Convenience vars
   * (these should never change)
   */
  var public = {}
    , ctx
    , now
    ;

  public.setContext = function(_ctx) {
    ctx = _ctx;
    now = function() { return ctx.currentTime; }
  };

  function Note(freq, attr, dest) {
    this.attr      = attr;
    this.frequency = freq;
    this.dest      = dest;
    this.playing   = false;

    this.setupGainNode();
    this.setupSource();
  };


  Note.prototype.play = function(time) {

    if (time === undefined) {
      console.log("Note.prototype.play(): Time was undefined");
      time = now();
    }

    console.log("Note.play atTime: " + time + " now: " + now());

    this.source.noteOn(time);
    this.rampUpGain(time);
  };

  Note.prototype.stop = function(time) {
    if (time === undefined) {
      console.log("Note.prototype.stop(): Time was undefined");
      time = now();
    }

    var endTime = time + this.attr.release
      , gain    = this.gainNode.gain
      ;

    //gain.exponentialRampToValueAtTime(this.attr.targetVolume, time);
    gain.exponentialRampToValueAtTime(ZERO, endTime);
    gain.cancelScheduledValues(endTime + ZERO);

    this.source.noteOff(endTime + 10);
  }

  Note.prototype.pulse = function(startTime) {
    if (startTime === undefined) { startTime = now(); }

    if (!this.playing) {
      this.playing = true;

      this.setupGainNode();
      this.setupSource();
      this.source.noteOn(startTime);
    }

    var volume    = this.attr.targetVolume
      , gain      = this.gainNode.gain
      , attack    = this.attr.attack
      , release   = this.attr.release
      , peakTime  = startTime + attack
      , endTime   = peakTime + release
      ;


    gain.exponentialRampToValueAtTime(ZERO, startTime);
    gain.exponentialRampToValueAtTime(volume, peakTime);
    gain.exponentialRampToValueAtTime(ZERO, endTime);
  };


  Note.prototype.setupSource = function(time) {
    var gainNode = this.gainNode
      , source = ctx.createOscillator()
      ;

    this.source = source;

    if (typeof this.attr.waveForm !== 'undefined') {
      source.type = this.attr.waveForm;
    }
    source.connect(gainNode);
    source.frequency.value = this.frequency;
  };

  Note.prototype.rampUpGain = function(time) {
    var endTime = time + this.attr.attack
      , targetVolume = this.attr.targetVolume
      ;

    console.log("rampUpGain for time: " + time) ;

    var gain = this.gainNode.gain;
    gain.cancelScheduledValues(time);
    gain.setValueAtTime(ZERO, time);
    gain.exponentialRampToValueAtTime(targetVolume, endTime);
  };

  Note.prototype.setupGainNode = function() {
    var gainNode = ctx.createGainNode();
    this.gainNode = gainNode;
    gainNode.connect(this.dest);
  };

  public.klass = Note;

  return public;
});
