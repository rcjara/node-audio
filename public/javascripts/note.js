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
    console.log('play!');

    if (!this.playing) {
      var gainNode = ctx.createGainNode();
      gainNode.connect(dest);

      gainNode.gain.value = ZERO;
      this.gainNode = gainNode;

      var source = ctx.createOscillator();
      source.connect(gainNode);
      source.frequency.value = this.frequency;
      this.source = source;

      source.noteOn( now() );

      var endTime = now() + this.attr.attack
        , targetVolume = this.attr.targetVolume
        ;

      var attack = function() {
        console.log('endTime: ' + endTime);
        console.log('targetVolume: ' +targetVolume);
        console.log('gainNode' + gainNode.gain.value);

        gainNode.gain.setValueAtTime(ZERO, now() );
        gainNode.gain.linearRampToValueAtTime(targetVolume,
                                                   endTime);
      }
      setTimeout(attack, 1);

      this.playing = true;
    }
  }

  Note.prototype.stop = function() {
    console.log('release: ' + this.attr.release);

    if (this.playing) {
      var endTime = now() + this.attr.release;
      var curGain = this.gainNode.gain.value;
      console.log('curGain: ' + curGain);

      this.gainNode.gain.cancelScheduledValues( now() );
      this.gainNode.gain.setValueAtTime(curGain, now() );
      this.gainNode
          .gain
          .exponentialRampToValueAtTime(ZERO, endTime);


      var target = this;
      var killNoteFn = function() {
        target.source.noteOff(0);
        console.log('note killed');
      };
      setTimeout(killNoteFn, this.attr.release * 1000 + 10);

    }
  }

  return Note;
});
