// Ember Kitchen — the world. All game state and the rules that move it:
// orders arriving and expiring, the stove, the plate, serving, scoring.
'use strict';

function ekNewState() {
  return {
    mode: 'title', // 'title' | 'playing' | 'over'
    timeLeft: EK_CONFIG.shiftSeconds,
    score: 0,
    served: 0,
    missed: 0,
    combo: 0,
    bestCombo: 0,
    orders: [],
    nextOrderId: 1,
    orderTimer: EK_CONFIG.firstOrderDelay,
    plate: [],
    hand: null, // an ingredient id, or null
    burners: [
      { item: null, progress: 0, cooked: false, burn: 0 },
      { item: null, progress: 0, cooked: false, burn: 0 },
    ],
    particles: [],
    floaters: [],
    shake: 0,
    chefMood: 'idle', // 'idle' | 'happy' | 'worried' | 'sad'
    chefMoodT: 0,
    rushAnnounced: false,
    paused: false,
    elapsed: 0,
    lastTickSecond: -1,
    startedAt: 0,
  };
}

// A little burst of crumbs / stars at a point, for serves and pickups.
function ekBurst(state, x, y, color, n) {
  for (let i = 0; i < (n || 14); i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 40 + Math.random() * 130;
    state.particles.push({
      x: x, y: y,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60,
      life: 0.5 + Math.random() * 0.4, age: 0,
      color: color, size: 3 + Math.random() * 4,
    });
  }
}

function ekFloater(state, x, y, text, color) {
  state.floaters.push({ x: x, y: y, text: text, color: color, age: 0, life: 1.4 });
}

function ekSetMood(state, mood, seconds) {
  state.chefMood = mood;
  state.chefMoodT = seconds || 1.6;
}

// --- actions (called from clicks / keys) ---

function ekPickBin(state, binIndex) {
  if (state.mode !== 'playing') return;
  if (state.hand) { EK_Audio.error(); return; }
  const bin = EK_BINS[binIndex];
  if (!bin) return;
  state.hand = bin.id;
  EK_Audio.pickup();
}

function ekClickBurner(state, burnerIndex) {
  if (state.mode !== 'playing') return;
  const burner = state.burners[burnerIndex];
  if (!burner) return;
  // Burnt food: click to scrape it into the bin.
  if (burner.item === 'burned') {
    burner.item = null; burner.progress = 0; burner.cooked = false; burner.burn = 0;
    EK_Audio.click();
    return;
  }
  // Cooked and ready: pick it up.
  if (burner.item && burner.cooked) {
    if (state.hand) { EK_Audio.error(); return; }
    state.hand = burner.item;
    burner.item = null; burner.progress = 0; burner.cooked = false; burner.burn = 0;
    EK_Audio.pickup();
    return;
  }
  // Raw cookable in hand: start it cooking.
  if (!burner.item && state.hand && ekIsCookable(state.hand)) {
    burner.item = ekCookedFrom(state.hand);
    burner.progress = 0;
    burner.cooked = false;
    burner.burn = 0;
    state.hand = null;
    EK_Audio.cookStart();
    return;
  }
  EK_Audio.error();
}

function ekClickPlate(state) {
  if (state.mode !== 'playing') return;
  if (!state.hand) { EK_Audio.error(); return; }
  if (state.plate.length >= 5) { EK_Audio.error(); return; }
  state.plate.push(state.hand);
  ekBurst(state, 640, 350, '#f7c948', 8);
  state.hand = null;
  EK_Audio.place();
}

function ekClickTrash(state) {
  if (state.mode !== 'playing') return;
  if (state.hand) { state.hand = null; EK_Audio.click(); return; }
  if (state.plate.length) { state.plate = []; EK_Audio.click(); }
}

function ekTryServe(state) {
  if (state.mode !== 'playing') return;
  if (!state.plate.length) { EK_Audio.error(); return; }
  const match = state.orders.find((o) => ekPlateMatchesOrder(state.plate, o));
  if (!match) {
    state.shake = 0.35;
    state.combo = 0;
    ekSetMood(state, 'worried', 1.2);
    EK_Audio.error();
    return;
  }
  const patienceLeft = Math.max(0, match.patience / match.maxPatience);
  const tip = Math.round(EK_CONFIG.serveTipMax * patienceLeft);
  const mult = 1 + Math.min(EK_CONFIG.comboCap - 1, state.combo * EK_CONFIG.comboStep);
  const gained = Math.round((EK_CONFIG.serveBase + tip) * mult);
  state.score += gained;
  state.served += 1;
  state.combo += 1;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  state.orders = state.orders.filter((o) => o !== match);
  state.plate = [];
  ekBurst(state, 640, 350, '#ffd76a', 22);
  ekFloater(state, 640, 300, '+' + gained + (state.combo > 1 ? '  x' + mult.toFixed(1) : ''), '#2e7d32');
  ekSetMood(state, 'happy', 1.8);
  EK_Audio.serve();
}

// --- per-frame update ---

function ekUpdate(state, dt) {
  state.elapsed += dt;
  if (state.shake > 0) state.shake = Math.max(0, state.shake - dt);
  if (state.chefMoodT > 0) {
    state.chefMoodT -= dt;
    if (state.chefMoodT <= 0) state.chefMood = 'idle';
  }
  for (const p of state.particles) {
    p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 260 * dt;
  }
  state.particles = state.particles.filter((p) => p.age < p.life);
  for (const f of state.floaters) { f.age += dt; f.y -= 34 * dt; }
  state.floaters = state.floaters.filter((f) => f.age < f.life);

  if (state.mode !== 'playing') return;

  state.timeLeft -= dt;
  const whole = Math.ceil(state.timeLeft);
  if (whole !== state.lastTickSecond) {
    state.lastTickSecond = whole;
    if (whole <= 10 && whole > 0) EK_Audio.tick();
  }
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.mode = 'over';
    ekSetMood(state, 'sad', 999);
    return;
  }

  // Orders arrive on a quickening schedule, up to the board's cap.
  state.orderTimer -= dt;
  if (state.orderTimer <= 0) {
    if (state.orders.length < EK_CONFIG.maxOrders) {
      state.orders.push(ekDealOrder(state));
    }
    state.orderTimer = ekNextOrderDelay(state);
  }

  // Patience runs out: the ticket is lost and the combo breaks.
  let expired = null;
  for (const order of state.orders) {
    order.patience -= dt;
    if (order.patience <= 0 && !expired) expired = order;
  }
  if (expired) {
    state.orders = state.orders.filter((o) => o !== expired);
    state.missed += 1;
    state.combo = 0;
    ekSetMood(state, 'sad', 1.4);
    EK_Audio.expire();
  }
  // The chef worries when any ticket is nearly out of time.
  if (state.chefMood === 'idle' &&
      state.orders.some((o) => o.patience / o.maxPatience < 0.25)) {
    ekSetMood(state, 'worried', 1.0);
  }

  // The stove: cooking progresses, then the food sits in a grace window
  // before it burns.
  for (const burner of state.burners) {
    if (!burner.item || burner.item === 'burned') continue;
    if (!burner.cooked) {
      const raw = ekRawOf(burner.item);
      const need = EK_CONFIG.cookTime[raw] || 4;
      burner.progress += dt / need;
      if (burner.progress >= 1) {
        burner.progress = 1;
        burner.cooked = true;
        burner.burn = 0;
        EK_Audio.cooked();
      }
    } else {
      burner.burn += dt;
      if (burner.burn >= EK_CONFIG.burnGrace) {
        burner.item = 'burned';
        EK_Audio.burn();
        ekFloater(state, 205, 270, 'BURNT!', '#d94f3d');
      }
    }
  }

  // Rush hour: the last minute gets a warning so the player can push.
  if (!state.rushAnnounced && state.timeLeft <= EK_CONFIG.rushAtSecondsLeft && state.timeLeft > 0) {
    state.rushAnnounced = true;
    ekFloater(state, 640, 220, 'RUSH HOUR — final minute!', '#d94f3d');
    EK_Audio.start();
  }
}

function ekStartGame(state) {
  const fresh = ekNewState();
  fresh.mode = 'playing';
  fresh.startedAt = state.elapsed;
  Object.keys(fresh).forEach((k) => { state[k] = fresh[k]; });
  EK_Audio.ensure();
}
