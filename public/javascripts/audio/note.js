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
  };


  Note.prototype.play = function() {
    if (this.playing) { return; }
    this.playing = true;

    this.setupGainNode();
    this.setupSource();
    this.rampUpGain();
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

    if (typeof this.attr.waveForm !== 'undefined') {
      source.type = this.attr.waveForm;
    }
    source.connect(gainNode);
    source.frequency.value = this.frequency;
    source.noteOn( now() );
  };

  Note.prototype.rampUpGain = function() {
    var endTime = now() + this.attr.attack
      , targetVolume = this.attr.targetVolume
      ;

    var gain = this.gainNode.gain;
    gain.setValueAtTime(ZERO, now() );
    gain.linearRampToValueAtTime(targetVolume, endTime);
  };

  Note.prototype.setupGainNode = function() {
    var gainNode = ctx.createGainNode();
    this.gainNode = gainNode;
    gainNode.connect(this.dest);
  };

  public.klass = Note;

  return public;
});
