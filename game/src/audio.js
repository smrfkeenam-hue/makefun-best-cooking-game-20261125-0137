// Ember Kitchen — sound. Tiny synthesized blips through WebAudio, no
// audio files, so the game stays a handful of static files.
'use strict';

const EK_Audio = {
  ctx: null,
  muted: false,

  ensure() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      } catch (e) { this.ctx = null; }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },

  // A short tone: frequency, seconds, shape, and volume.
  blip(freq, dur, type, vol, when) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + (when || 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(vol || 0.12, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  },

  pickup() { this.blip(520, 0.07, 'triangle', 0.10); },
  place() { this.blip(340, 0.08, 'triangle', 0.12); this.blip(510, 0.06, 'sine', 0.08, 0.05); },
  cookStart() { this.blip(220, 0.12, 'sawtooth', 0.05); },
  cooked() { this.blip(660, 0.09, 'sine', 0.12); this.blip(880, 0.12, 'sine', 0.10, 0.09); },
  serve() {
    this.blip(523, 0.10, 'triangle', 0.12);
    this.blip(659, 0.10, 'triangle', 0.12, 0.09);
    this.blip(784, 0.16, 'triangle', 0.12, 0.18);
  },
  error() { this.blip(160, 0.15, 'square', 0.06); },
  expire() { this.blip(300, 0.2, 'sawtooth', 0.06); this.blip(210, 0.25, 'sawtooth', 0.06, 0.12); },
  tick() { this.blip(980, 0.04, 'square', 0.04); },
  click() { this.blip(700, 0.05, 'triangle', 0.08); },
  burn() { this.blip(140, 0.3, 'sawtooth', 0.07); this.blip(90, 0.35, 'square', 0.05, 0.1); },
  start() {
    this.blip(392, 0.09, 'triangle', 0.11);
    this.blip(523, 0.09, 'triangle', 0.11, 0.08);
    this.blip(659, 0.14, 'triangle', 0.11, 0.16);
  },
};
