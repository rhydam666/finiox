// Lightweight Web Audio API synthesizer for short video soundtrack simulation
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private currentTrack: string = '';
  private userInteractionBound = false;

  constructor() {
    // Automatically bind user interaction listener to resume audio context
    if (typeof window !== 'undefined') {
      const handleUserInteraction = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      };
      window.addEventListener('click', handleUserInteraction, { once: false, passive: true });
      window.addEventListener('keydown', handleUserInteraction, { once: false, passive: true });
      window.addEventListener('touchstart', handleUserInteraction, { once: false, passive: true });
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTrack(trackName: string) {
    this.stopTrack();
    this.initCtx();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentTrack = trackName;

    // Harmonized synth chord progression
    const chordSets: Record<string, number[][]> = {
      tech: [[261.63, 329.63, 392.00], [293.66, 349.23, 440.00], [220.00, 261.63, 329.63], [174.61, 220.00, 261.63]],
      culinary: [[329.63, 392.00, 493.88], [261.63, 329.63, 392.00], [220.00, 277.18, 329.63], [196.00, 246.94, 293.66]],
      fitness: [[130.81, 196.00, 261.63], [146.83, 220.00, 293.66], [110.00, 164.81, 220.00], [123.47, 185.00, 246.94]],
      travel: [[220.00, 261.63, 329.63, 392.00], [174.61, 220.00, 261.63, 329.63], [196.00, 246.94, 293.66, 369.99], [220.00, 261.63, 329.63, 392.00]],
    };

    let genre = 'tech';
    if (trackName.toLowerCase().includes('flavour') || trackName.toLowerCase().includes('kitchen') || trackName.toLowerCase().includes('culinary')) {
      genre = 'culinary';
    } else if (trackName.toLowerCase().includes('workout') || trackName.toLowerCase().includes('bass') || trackName.toLowerCase().includes('pump')) {
      genre = 'fitness';
    } else if (trackName.toLowerCase().includes('wander') || trackName.toLowerCase().includes('ocean') || trackName.toLowerCase().includes('drift')) {
      genre = 'travel';
    }

    const chords = chordSets[genre] || chordSets.tech;
    let step = 0;

    const playStep = () => {
      if (!this.isPlaying || !this.ctx) return;
      const currentChord = chords[step % chords.length];
      const now = this.ctx.currentTime;

      // Play soft pad chord
      currentChord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = genre === 'fitness' ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.04 / (idx + 1), now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.65);
      });

      // Play subtle percussive tick/kick
      if (step % 2 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'triangle';
        kickOsc.frequency.setValueAtTime(genre === 'fitness' ? 120 : 90, now);
        kickOsc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

        kickGain.gain.setValueAtTime(0.08, now);
        kickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

        kickOsc.connect(kickGain);
        kickGain.connect(this.ctx.destination);

        kickOsc.start(now);
        kickOsc.stop(now + 0.16);
      }

      step++;
      this.timerId = window.setTimeout(playStep, 450);
    };

    playStep();
  }

  stopTrack() {
    this.isPlaying = false;
    this.currentTrack = '';
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const soundEngine = new SoundEngine();
