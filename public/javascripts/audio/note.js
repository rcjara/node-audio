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
    this.startedPlayingAt = false;

    this.setupGainNode();
    this.setupSource();
  };


  Note.prototype.play = function(time) {

    if (time === undefined) {
      console.log("Note.prototype.play(): Time was undefined");
      time = now();
    }

    this.playing = true;

    this.source.noteOn(time);
    this.rampUpGain(time);
  };

  Note.prototype.stop = function(time) {
    if (time === undefined) {
      time = now();
    }

    if (!this.playing) { console.log("Why was this not playing"); }

    var endTime = time + this.attr.release
      , gain    = this.gainNode.gain
      ;


    gain.setValueAtTime(this.volumeAtTime(time), time);
    gain.exponentialRampToValueAtTime(ZERO, endTime);

    //this.source.noteOff(endTime + ZERO);
  }

  Note.prototype.volumeAtTime = function(t) {
    var v0 = ZERO
      , v1 = this.attr.targetVolume
      , t0 = this.startedPlayingAt
      , t1 = this.startedPlayingAt + this.attr.attack
      ;

    if (v0 === undefined || t < t0) { return ZERO; }
    if (t > t1)                     { return v1; }

    return v0 * Math.pow((v1 / v0), ((t - t0) / (t1 - t0)));
  };

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
      , gain = this.gainNode.gain;
      ;

    this.startedPlayingAt = time;
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
