// Ember Kitchen — boot and loop. Wires input to the world, runs the
// frame loop, and offers scripted ?demo=N states so the maker can take
// honest screenshots of a mid-rush kitchen.
'use strict';

const EK_Main = {
  canvas: null,
  ctx: null,
  state: ekNewState(),
  last: 0,

  boot() {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');
    EK_Input.attach(this.canvas, (x, y) => this.onClick(x, y), (key) => this.onKey(key));
    const params = new URLSearchParams(window.location.search);
    const demo = params.get('demo');
    if (demo) this.applyDemo(demo);
    this.last = performance.now();
    const step = (now) => {
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      if (!this.state.paused) ekUpdate(this.state, dt);
      ekRender(this.ctx, this.state, EK_Input.mouse);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },

  onClick(x, y) {
    const s = this.state;
    if (s.mode === 'title') { ekStartGame(s); return; }
    if (s.mode === 'over') { ekStartGame(s); return; }
    // Bins first.
    for (let i = 0; i < EK_BINS.length; i++) {
      if (ekPointInRect(x, y, ekBinRect(i))) { ekPickBin(s, i); return; }
    }
    if (ekPointInRect(x, y, EK_LAYOUT.burnerA)) { ekClickBurner(s, 0); return; }
    if (ekPointInRect(x, y, EK_LAYOUT.burnerB)) { ekClickBurner(s, 1); return; }
    if (ekPointInRect(x, y, EK_LAYOUT.serveBtn)) { ekTryServe(s); return; }
    if (ekPointInRect(x, y, EK_LAYOUT.trashBtn)) { ekClickTrash(s); return; }
    if (ekPointInRect(x, y, EK_LAYOUT.plate)) { ekClickPlate(s); return; }
  },

  onKey(key) {
    const s = this.state;
    if (key === 'm') { EK_Audio.muted = !EK_Audio.muted; return; }
    if (key === 'p' && s.mode === 'playing') { s.paused = !s.paused; return; }
    if (s.paused) return;
    if (s.mode === 'title' && (key === 'enter' || key === ' ')) { ekStartGame(s); return; }
    if (s.mode === 'over' && (key === 'r' || key === 'enter' || key === ' ')) { ekStartGame(s); return; }
    if (s.mode !== 'playing') return;
    if (key === ' ') { ekTryServe(s); return; }
    if (key === 't') { ekClickTrash(s); return; }
    const binIndex = EK_BINS.findIndex((b) => b.key === key);
    if (binIndex >= 0) ekPickBin(s, binIndex);
  },

  // Scripted states for screenshots: the same live game, frozen into a
  // photogenic moment. demo=1: dish mid-assembly. demo=2: stove busy.
  // demo=3: a completed plate about to be served.
  applyDemo(demo) {
    const s = this.state;
    ekStartGame(s);
    s.timeLeft = 154; // 2:34 on the clock.
    s.score = 480;
    s.served = 4;
    s.combo = 2;
    s.orders = [
      { id: 1, dish: 'Sunny Burger', items: ['bun', 'pattyCooked', 'lettuce', 'tomato'], color: '#e8a13c', patience: 26, maxPatience: 48 },
      { id: 2, dish: 'Ember Pasta', items: ['pastaCooked', 'tomato', 'cheese', 'chili'], color: '#d94f3d', patience: 14, maxPatience: 40 },
      { id: 3, dish: 'Golden Soup', items: ['broth', 'mushroom', 'eggCooked'], color: '#c98a3e', patience: 38, maxPatience: 48 },
    ];
    if (demo === '1') {
      // Mid-assembly: bun + patty on the plate, tomato in hand.
      s.plate = ['bun', 'pattyCooked'];
      s.hand = 'tomato';
      EK_Input.mouse.x = 640; EK_Input.mouse.y = 380;
    } else if (demo === '2') {
      // Stove busy: patty nearly done, pasta just started; salad on plate.
      s.burners[0] = { item: 'pattyCooked', progress: 1, cooked: true, burn: 1.2 };
      s.burners[1] = { item: 'pastaCooked', progress: 0.45, cooked: false, burn: 0 };
      s.plate = ['lettuce', 'tomato'];
      s.hand = 'cheese';
      EK_Input.mouse.x = 700; EK_Input.mouse.y = 360;
    } else if (demo === '3') {
      // Complete burger on the plate, serve button live, tip floater.
      s.plate = ['bun', 'pattyCooked', 'lettuce', 'tomato'];
      s.burners[0] = { item: 'eggCooked', progress: 1, cooked: true, burn: 0.5 };
      ekSetMood(s, 'happy', 5);
      ekBurst(s, 640, 350, '#ffd76a', 18);
      ekFloater(s, 640, 300, '+150', '#2e7d32');
    }
  },
};

window.addEventListener('DOMContentLoaded', () => EK_Main.boot());
