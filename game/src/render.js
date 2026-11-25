// Ember Kitchen — the renderer. Every pixel of the kitchen, drawn with
// canvas shapes: no image assets, so the game is a few kilobytes of code.
'use strict';

function ekRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function ekText(ctx, text, x, y, size, color, align, weight) {
  ctx.fillStyle = color;
  ctx.font = (weight || 'bold') + ' ' + size + 'px system-ui, sans-serif';
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

// A small drawn icon for an ingredient id, centred at (x, y), radius r.
function ekDrawIngredient(ctx, id, x, y, r) {
  const style = EK_INGREDIENT_STYLE[id] || EK_INGREDIENT_STYLE.burned;
  ctx.save();
  ctx.translate(x, y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = style.rim;
  ctx.fillStyle = style.fill;
  if (id === 'bun') {
    ctx.beginPath(); ctx.arc(0, 2, r, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillRect(-r, 2, r * 2, r * 0.45);
    ctx.fillStyle = '#fff3d6';
    ctx.beginPath(); ctx.arc(-r * 0.4, -r * 0.35, r * 0.12, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.35, -r * 0.5, r * 0.12, 0, 7); ctx.fill();
  } else if (id === 'patty' || id === 'pattyCooked') {
    ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.62, 0, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.1, r * 0.14, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.35, r * 0.12, r * 0.12, 0, 7); ctx.fill();
    if (id === 'pattyCooked') {
      ctx.strokeStyle = '#5d3c1c'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-r * 0.6, r * 0.3); ctx.lineTo(r * 0.6, r * 0.3); ctx.stroke();
    }
  } else if (id === 'pasta' || id === 'pastaCooked') {
    ctx.lineWidth = 3; ctx.strokeStyle = style.rim;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.arc(i * r * 0.45, 0, r * 0.42, Math.PI * 0.15, Math.PI * 0.85, true);
      ctx.stroke();
    }
    ctx.fillStyle = style.fill;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.2, 0, 7); ctx.fill();
  } else if (id === 'egg' || id === 'eggCooked') {
    ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.8, 0, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = id === 'eggCooked' ? '#f7c948' : '#f2b705';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.45, 0, 7); ctx.fill();
  } else if (id === 'lettuce') {
    ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.55, 0, 0, 7); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = style.rim; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-r * 0.7, 0);
    ctx.quadraticCurveTo(0, -r * 0.5, r * 0.7, 0); ctx.stroke();
  } else if (id === 'tomato') {
    ctx.beginPath(); ctx.arc(0, 0, r * 0.9, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3f7d33';
    ctx.beginPath(); ctx.moveTo(0, -r * 0.9); ctx.lineTo(-r * 0.35, -r * 1.25);
    ctx.lineTo(0, -r * 1.05); ctx.lineTo(r * 0.35, -r * 1.25); ctx.closePath(); ctx.fill();
  } else if (id === 'cheese') {
    ctx.beginPath(); ctx.moveTo(-r, r * 0.7); ctx.lineTo(r, r * 0.7); ctx.lineTo(0, -r * 0.8);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = style.rim;
    ctx.beginPath(); ctx.arc(-r * 0.25, r * 0.3, r * 0.14, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.3, r * 0.05, r * 0.11, 0, 7); ctx.fill();
  } else if (id === 'mushroom') {
    ctx.beginPath(); ctx.arc(0, -r * 0.1, r * 0.85, Math.PI, 0); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f2e8d5';
    ctx.fillRect(-r * 0.28, -r * 0.1, r * 0.56, r * 0.75);
    ctx.strokeStyle = style.rim; ctx.strokeRect(-r * 0.28, -r * 0.1, r * 0.56, r * 0.75);
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.55, r * 0.16, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.3, -r * 0.7, r * 0.12, 0, 7); ctx.fill();
  } else if (id === 'broth') {
    ctx.beginPath(); ctx.arc(0, -r * 0.2, r * 0.9, 0, Math.PI); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-r * 0.4, -r * 0.9); ctx.quadraticCurveTo(-r * 0.2, -r * 1.3, -r * 0.4, -r * 1.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(r * 0.3, -r * 0.9); ctx.quadraticCurveTo(r * 0.5, -r * 1.3, r * 0.3, -r * 1.6); ctx.stroke();
  } else if (id === 'chili') {
    ctx.strokeStyle = style.rim; ctx.lineWidth = 2;
    ctx.fillStyle = style.fill;
    ctx.beginPath();
    ctx.moveTo(-r * 0.8, -r * 0.5);
    ctx.quadraticCurveTo(0, -r * 1.1, r * 0.7, -r * 0.2);
    ctx.quadraticCurveTo(r * 0.9, r * 0.5, r * 0.2, r * 0.8);
    ctx.quadraticCurveTo(-r * 0.5, r * 0.6, -r * 0.8, -r * 0.5);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#3f7d33'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-r * 0.8, -r * 0.5); ctx.quadraticCurveTo(-r * 1.1, -r * 0.9, -r * 0.7, -r * 1.1); ctx.stroke();
  } else { // burned
    ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, 7); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(200,200,200,0.6)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-r * 0.3, -r * 0.7); ctx.quadraticCurveTo(0, -r * 1.2, r * 0.2, -r * 1.5); ctx.stroke();
  }
  ctx.restore();
}

function ekDrawChef(ctx, x, y, mood, t) {
  const bob = Math.sin(t * 2) * 3;
  ctx.save();
  ctx.translate(x, y + bob);
  // Body + apron.
  ctx.fillStyle = '#fdf6e3';
  ekRoundRect(ctx, -52, -10, 104, 130, 18); ctx.fill();
  ctx.fillStyle = '#4c9a4c';
  ekRoundRect(ctx, -52, 44, 104, 76, 12); ctx.fill();
  ctx.fillStyle = '#3f7d33';
  ctx.fillRect(-52, 44, 104, 10);
  // Arms.
  ctx.fillStyle = '#fdf6e3';
  ekRoundRect(ctx, -68, -2, 20, 66, 9); ctx.fill();
  ekRoundRect(ctx, 48, -2, 20, 66, 9); ctx.fill();
  // Head.
  ctx.fillStyle = '#f2c79b';
  ctx.beginPath(); ctx.arc(0, -44, 34, 0, 7); ctx.fill();
  // Chef hat.
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-20, -70, 17, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(0, -78, 19, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(20, -70, 17, 0, 7); ctx.fill();
  ctx.fillRect(-30, -76, 60, 16);
  // Eyes + mouth by mood.
  ctx.fillStyle = '#2a1a10';
  if (mood === 'happy') {
    ctx.beginPath(); ctx.arc(-12, -48, 3.5, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(12, -48, 3.5, Math.PI, 0); ctx.fill();
    ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(0, -34, 12, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  } else if (mood === 'worried' || mood === 'sad') {
    ctx.beginPath(); ctx.arc(-12, -48, 3, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(12, -48, 3, 0, 7); ctx.fill();
    ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(0, -22, 9, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke();
    if (mood === 'worried') {
      ctx.strokeStyle = '#2a1a10';
      ctx.beginPath(); ctx.moveTo(-20, -62); ctx.lineTo(-6, -58); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(20, -62); ctx.lineTo(6, -58); ctx.stroke();
    }
  } else {
    ctx.beginPath(); ctx.arc(-12, -48, 3, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(12, -48, 3, 0, 7); ctx.fill();
    ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(-8, -30); ctx.lineTo(8, -30); ctx.stroke();
  }
  // Blush.
  ctx.fillStyle = 'rgba(217,79,61,0.35)';
  ctx.beginPath(); ctx.arc(-22, -36, 6, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(22, -36, 6, 0, 7); ctx.fill();
  ctx.restore();
}

function ekDrawTicket(ctx, order, i, t) {
  const r = ekTicketRect(i);
  const frac = Math.max(0, order.patience / order.maxPatience);
  const urgent = frac < 0.3;
  ctx.save();
  if (urgent) ctx.translate(Math.sin(t * 14) * 1.5, 0);
  ctx.fillStyle = EK_COLORS.ticket;
  ctx.strokeStyle = EK_COLORS.ticketEdge;
  ctx.lineWidth = 2;
  ekRoundRect(ctx, r.x, r.y, r.w, r.h, 8); ctx.fill(); ctx.stroke();
  // Pin.
  ctx.fillStyle = '#d94f3d';
  ctx.beginPath(); ctx.arc(r.x + r.w / 2, r.y + 8, 5, 0, 7); ctx.fill();
  ekText(ctx, order.dish, r.x + r.w / 2, r.y + 30, 19, EK_COLORS.ink);
  // Ingredient dots.
  const dotY = r.y + 58;
  const step = 44;
  const startX = r.x + r.w / 2 - ((order.items.length - 1) * step) / 2;
  order.items.forEach((item, k) => {
    ekDrawIngredient(ctx, item, startX + k * step, dotY, 15);
  });
  // Patience bar.
  const barX = r.x + 14, barY = r.y + r.h - 22, barW = r.w - 28, barH = 10;
  ctx.fillStyle = '#e8dcc8';
  ekRoundRect(ctx, barX, barY, barW, barH, 5); ctx.fill();
  ctx.fillStyle = urgent ? EK_COLORS.red : (frac < 0.6 ? EK_COLORS.gold : EK_COLORS.green);
  if (frac > 0) { ekRoundRect(ctx, barX, barY, barW * frac, barH, 5); ctx.fill(); }
  ctx.restore();
}

function ekDrawBurner(ctx, burner, rect, index, t, hover) {
  ctx.fillStyle = EK_COLORS.stoveTop;
  ekRoundRect(ctx, rect.x - 8, rect.y - 8, rect.w + 16, rect.h + 16, 12); ctx.fill();
  if (hover) {
    ctx.strokeStyle = '#ffd76a'; ctx.lineWidth = 3;
    ekRoundRect(ctx, rect.x - 8, rect.y - 8, rect.w + 16, rect.h + 16, 12); ctx.stroke();
  }
  const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2;
  // Burner ring.
  ctx.fillStyle = '#1c1c22';
  ctx.beginPath(); ctx.arc(cx, cy, 44, 0, 7); ctx.fill();
  ctx.strokeStyle = '#55555e'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, 44, 0, 7); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 30, 0, 7); ctx.stroke();
  if (!burner.item) {
    ekText(ctx, 'empty', cx, cy + 62, 11, '#8a8a92');
    return;
  }
  if (burner.item === 'burned') {
    ekDrawIngredient(ctx, 'burned', cx, cy - 4, 26);
    ekText(ctx, 'BURNT — click to toss', cx, cy + 62, 11, EK_COLORS.red);
    return;
  }
  // Flames while cooking.
  if (!burner.cooked) {
    const f = 0.7 + Math.sin(t * 9 + index * 2) * 0.3;
    ctx.fillStyle = 'rgba(232,120,40,0.85)';
    ctx.beginPath();
    ctx.moveTo(cx - 26, cy + 30);
    ctx.quadraticCurveTo(cx - 30, cy - 10 * f, cx, cy - 26 * f);
    ctx.quadraticCurveTo(cx + 30, cy - 10 * f, cx + 26, cy + 30);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(247,201,72,0.9)';
    ctx.beginPath();
    ctx.moveTo(cx - 15, cy + 30);
    ctx.quadraticCurveTo(cx - 16, cy - 4 * f, cx, cy - 14 * f);
    ctx.quadraticCurveTo(cx + 16, cy - 4 * f, cx + 15, cy + 30);
    ctx.closePath(); ctx.fill();
  }
  // The food, on a little pan.
  ctx.fillStyle = '#8a8a92';
  ctx.beginPath(); ctx.ellipse(cx, cy + 16, 40, 12, 0, 0, 7); ctx.fill();
  ekDrawIngredient(ctx, burner.item, cx, cy - 2, 26);
  // Cook progress ring.
  if (!burner.cooked) {
    ctx.strokeStyle = '#ffd76a'; ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy - 2, 38, -Math.PI / 2, -Math.PI / 2 + burner.progress * Math.PI * 2);
    ctx.stroke();
  } else {
    const burnFrac = burner.burn / EK_CONFIG.burnGrace;
    ctx.strokeStyle = burnFrac > 0.6 ? EK_COLORS.red : EK_COLORS.green;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy - 2, 38, -Math.PI / 2, -Math.PI / 2 + (1 - burnFrac) * Math.PI * 2);
    ctx.stroke();
    ekText(ctx, 'READY!', cx, cy + 62, 12, EK_COLORS.green);
  }
}

function ekRender(ctx, state, mouse) {
  const W = EK_CONFIG.width, H = EK_CONFIG.height;
  const t = state.elapsed;
  ctx.save();
  if (state.shake > 0) {
    ctx.translate((Math.random() - 0.5) * state.shake * 22, (Math.random() - 0.5) * state.shake * 22);
  }
  // Wall + floor.
  const wall = ctx.createLinearGradient(0, 0, 0, 500);
  wall.addColorStop(0, EK_COLORS.wallTop);
  wall.addColorStop(1, EK_COLORS.wallBottom);
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, 500);
  ctx.fillStyle = EK_COLORS.floorA;
  ctx.fillRect(0, 500, W, 220);
  ctx.fillStyle = EK_COLORS.floorB;
  for (let x = 0; x < W; x += 80) ctx.fillRect(x, 500, 2, 220);
  for (let y = 500; y < H; y += 55) ctx.fillRect(0, y, W, 2);
  // (A sunset window used to hang here; the order board covers that
  // corner now, so the wall stays plain and the board owns the space.)

  // Top bar.
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(0, 0, W, EK_LAYOUT.topBar.h);
  ekText(ctx, 'EMBER KITCHEN', 24, 30, 26, '#ffd76a', 'left');
  const mm = Math.floor(Math.max(0, state.timeLeft) / 60);
  const ss = Math.floor(Math.max(0, state.timeLeft) % 60);
  const timeStr = mm + ':' + String(ss).padStart(2, '0');
  const lowTime = state.mode === 'playing' && state.timeLeft <= 30;
  ekText(ctx, '⏱ ' + timeStr, 640, 30, 26, lowTime ? '#ff8a7a' : '#fff3d6');
  ekText(ctx, 'SCORE  ' + state.score, 1100, 24, 20, '#fff3d6', 'right');
  ekText(ctx, 'SERVED ' + state.served + (state.combo > 1 ? '   COMBO x' + (1 + Math.min(1, (state.combo - 1) * 0.1)).toFixed(1) : ''),
    1100, 46, 13, '#d8c3a5', 'right');

  // Order board.
  ctx.fillStyle = EK_COLORS.board;
  ekRoundRect(ctx, EK_LAYOUT.board.x, EK_LAYOUT.board.y, EK_LAYOUT.board.w, EK_LAYOUT.board.h, 10); ctx.fill();
  ctx.strokeStyle = EK_COLORS.boardEdge; ctx.lineWidth = 3;
  ekRoundRect(ctx, EK_LAYOUT.board.x, EK_LAYOUT.board.y, EK_LAYOUT.board.w, EK_LAYOUT.board.h, 10); ctx.stroke();
  if (!state.orders.length && state.mode === 'playing') {
    ekText(ctx, 'No orders yet — the rush is coming…', 640, EK_LAYOUT.board.y + 60, 16, '#e8dcc8');
  }
  state.orders.forEach((o, i) => ekDrawTicket(ctx, o, i, t));

  // Stove.
  ctx.fillStyle = EK_COLORS.stove;
  ekRoundRect(ctx, EK_LAYOUT.stove.x, EK_LAYOUT.stove.y, EK_LAYOUT.stove.w, EK_LAYOUT.stove.h, 12); ctx.fill();
  ekText(ctx, 'STOVE', EK_LAYOUT.stove.x + 16, EK_LAYOUT.stove.y + 22, 14, '#ffd76a', 'left');
  ekDrawBurner(ctx, state.burners[0], EK_LAYOUT.burnerA, 0, t, EK_Input.hoverBurner === 0);
  ekDrawBurner(ctx, state.burners[1], EK_LAYOUT.burnerB, 1, t, EK_Input.hoverBurner === 1);
  ekText(ctx, 'Watch the ring — grab it when READY or it burns!', EK_LAYOUT.stove.x + EK_LAYOUT.stove.w / 2, EK_LAYOUT.stove.y + 232, 12, '#c9c9cf');

  // Assembly plate.
  const pr = EK_LAYOUT.plate;
  ctx.fillStyle = EK_COLORS.counterTop;
  ekRoundRect(ctx, pr.x - 16, pr.y - 16, pr.w + 32, pr.h + 32, 14); ctx.fill();
  ctx.strokeStyle = '#8a5a33'; ctx.lineWidth = 3;
  ekRoundRect(ctx, pr.x - 16, pr.y - 16, pr.w + 32, pr.h + 32, 14); ctx.stroke();
  ctx.fillStyle = EK_COLORS.plate;
  ctx.beginPath(); ctx.ellipse(pr.x + pr.w / 2, pr.y + pr.h / 2 + 8, 150, 78, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = EK_COLORS.plateEdge; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(pr.x + pr.w / 2, pr.y + pr.h / 2 + 8, 150, 78, 0, 0, 7); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(pr.x + pr.w / 2, pr.y + pr.h / 2 + 8, 108, 52, 0, 0, 7); ctx.stroke();
  if (!state.plate.length) {
    ekText(ctx, 'PLATE — click to add what you hold', pr.x + pr.w / 2, pr.y + pr.h / 2 + 8, 14, '#b09a7a');
  } else {
    const n = state.plate.length;
    const step = 56;
    const startX = pr.x + pr.w / 2 - ((n - 1) * step) / 2;
    state.plate.forEach((item, k) => {
      ekDrawIngredient(ctx, item, startX + k * step, pr.y + pr.h / 2 + 8 - (k % 2) * 8, 24);
    });
  }
  ekText(ctx, 'BUILD THE DISH HERE', pr.x + pr.w / 2, pr.y - 2, 12, '#7a5c3e');
  // Hand slot.
  const hs = EK_LAYOUT.handSlot;
  ekText(ctx, state.hand ? 'HOLDING: ' + (EK_INGREDIENT_STYLE[state.hand] || {}).label : 'HANDS EMPTY — grab an ingredient below',
    hs.x + hs.w / 2, hs.y + 18, 13, state.hand ? '#2e7d32' : '#7a5c3e');

  // Serve + trash buttons.
  const sb = EK_LAYOUT.serveBtn;
  const canServe = state.mode === 'playing' && state.plate.length > 0 &&
    state.orders.some((o) => ekPlateMatchesOrder(state.plate, o));
  ctx.fillStyle = canServe ? EK_COLORS.green : '#9a8a7a';
  ekRoundRect(ctx, sb.x, sb.y, sb.w, sb.h, 12); ctx.fill();
  if (EK_Input.hoverServe && state.mode === 'playing') {
    ctx.strokeStyle = '#ffd76a'; ctx.lineWidth = 3;
    ekRoundRect(ctx, sb.x, sb.y, sb.w, sb.h, 12); ctx.stroke();
  }
  ekText(ctx, 'SERVE!', sb.x + sb.w / 2, sb.y + 26, 22, '#fff');
  ekText(ctx, 'SPACE', sb.x + sb.w / 2, sb.y + 50, 11, '#e8f5e8');
  const tb = EK_LAYOUT.trashBtn;
  ctx.fillStyle = '#6e4525';
  ekRoundRect(ctx, tb.x, tb.y, tb.w, tb.h, 12); ctx.fill();
  if (EK_Input.hoverTrash) {
    ctx.strokeStyle = '#ffd76a'; ctx.lineWidth = 3;
    ekRoundRect(ctx, tb.x, tb.y, tb.w, tb.h, 12); ctx.stroke();
  }
  ekText(ctx, 'TRASH', tb.x + tb.w / 2, tb.y + 26, 20, '#fff');
  ekText(ctx, 'clear plate / hand', tb.x + tb.w / 2, tb.y + 50, 11, '#e8dcc8');

  // Chef.
  ekDrawChef(ctx, EK_LAYOUT.chef.x + 105, EK_LAYOUT.chef.y + 150, state.chefMood, t);
  ekText(ctx, 'CHEF MIRA', EK_LAYOUT.chef.x + 105, EK_LAYOUT.chef.y + 14, 12, '#7a5c3e');

  // Ingredient bins.
  ctx.fillStyle = EK_COLORS.counter;
  ekRoundRect(ctx, EK_LAYOUT.bins.x - 8, EK_LAYOUT.bins.y - 8, EK_LAYOUT.bins.w + 16, EK_LAYOUT.bins.h + 16, 12); ctx.fill();
  EK_BINS.forEach((bin, i) => {
    const r = ekBinRect(i);
    const hover = EK_Input.hoverBin === i;
    ctx.fillStyle = hover ? '#f2e2bd' : '#fff8e6';
    ekRoundRect(ctx, r.x, r.y, r.w, r.h, 10); ctx.fill();
    ctx.strokeStyle = hover ? EK_COLORS.gold : '#d9cba6';
    ctx.lineWidth = hover ? 3 : 2;
    ekRoundRect(ctx, r.x, r.y, r.w, r.h, 10); ctx.stroke();
    ekDrawIngredient(ctx, bin.id, r.x + r.w / 2, r.y + 58, 30);
    ekText(ctx, EK_INGREDIENT_STYLE[bin.id].label, r.x + r.w / 2, r.y + 112, 15, EK_COLORS.ink);
    ekText(ctx, '[' + bin.key + ']' + (bin.cookable ? '  cook me' : ''), r.x + r.w / 2, r.y + 136, 11, EK_COLORS.softInk);
    if (state.hand === bin.id) {
      ctx.strokeStyle = EK_COLORS.green; ctx.lineWidth = 4;
      ekRoundRect(ctx, r.x + 3, r.y + 3, r.w - 6, r.h - 6, 8); ctx.stroke();
    }
  });
  ekText(ctx, 'INGREDIENTS — click a bin or press its key', EK_LAYOUT.bins.x + 4, EK_LAYOUT.bins.y - 15, 12, '#7a5c3e', 'left');

  // Steam wisps over the stove, and a RUSH banner in the final minute.
  if (state.mode === 'playing') {
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const sx = 130 + i * 90;
      const sway = Math.sin(t * 2 + i * 2.1) * 8;
      ctx.beginPath();
      ctx.moveTo(sx, 232);
      ctx.quadraticCurveTo(sx + sway, 214, sx + sway * 0.5, 196);
      ctx.stroke();
    }
    if (state.timeLeft <= EK_CONFIG.rushAtSecondsLeft) {
      ctx.fillStyle = '#d94f3d';
      ekRoundRect(ctx, 560, 196, 160, 26, 8); ctx.fill();
      ekText(ctx, 'RUSH HOUR', 640, 210, 14, '#fff');
    }
  }

  // Held item follows the cursor.
  if (state.hand && state.mode === 'playing') {
    ekDrawIngredient(ctx, state.hand, mouse.x, mouse.y - 18, 20);
    ctx.fillStyle = 'rgba(58,42,26,0.85)';
    ekRoundRect(ctx, mouse.x - 34, mouse.y + 8, 68, 20, 8); ctx.fill();
    ekText(ctx, (EK_INGREDIENT_STYLE[state.hand] || {}).label, mouse.x, mouse.y + 19, 11, '#fff');
  }

  // Particles + floaters.
  for (const p of state.particles) {
    ctx.globalAlpha = 1 - p.age / p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1;
  for (const f of state.floaters) {
    ctx.globalAlpha = Math.max(0, 1 - f.age / f.life);
    ekText(ctx, f.text, f.x, f.y, 26, f.color);
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // Overlays (not shaken).
  if (state.paused && state.mode === 'playing') {
    ctx.fillStyle = 'rgba(43,29,22,0.6)';
    ctx.fillRect(0, 0, EK_CONFIG.width, EK_CONFIG.height);
    ekText(ctx, 'PAUSED — press P to keep cooking', 640, 360, 30, '#fff3d6');
  }
  if (state.mode === 'title') ekDrawTitle(ctx, t);
  if (state.mode === 'over') ekDrawGameOver(ctx, state);
}

function ekDrawTitle(ctx, t) {
  ctx.fillStyle = 'rgba(43,29,22,0.72)';
  ctx.fillRect(0, 0, EK_CONFIG.width, EK_CONFIG.height);
  ctx.fillStyle = '#fff3d6';
  ekRoundRect(ctx, 290, 120, 700, 460, 18); ctx.fill();
  ctx.strokeStyle = EK_COLORS.gold; ctx.lineWidth = 4;
  ekRoundRect(ctx, 290, 120, 700, 460, 18); ctx.stroke();
  ekText(ctx, 'EMBER KITCHEN', 640, 178, 52, '#d94f3d');
  ekText(ctx, 'The lunch rush is on. Cook fast, serve faster.', 640, 222, 19, EK_COLORS.softInk);
  const lines = [
    '1.  Click an ingredient bin (or press 1–0) to pick it up.',
    '2.  Raw patty, pasta and egg must visit the STOVE —',
    '     click a burner to cook, grab it when READY, before it burns.',
    '3.  Click the PLATE to build the dish an order ticket asks for.',
    '4.  Click SERVE (or SPACE) when the plate matches a ticket.',
    '     Faster serves earn bigger tips. Missed tickets break combos.',
    '     You have 3 minutes. Good luck, Chef!',
  ];
  lines.forEach((line, i) => ekText(ctx, line, 640, 268 + i * 28, 16, EK_COLORS.ink));
  const pulse = 0.75 + Math.sin(t * 4) * 0.25;
  ctx.globalAlpha = pulse;
  ctx.fillStyle = EK_COLORS.green;
  ekRoundRect(ctx, 490, 500, 300, 56, 14); ctx.fill();
  ctx.globalAlpha = 1;
  ekText(ctx, 'CLICK TO START', 640, 529, 22, '#fff');
}

function ekDrawGameOver(ctx, state) {
  ctx.fillStyle = 'rgba(43,29,22,0.72)';
  ctx.fillRect(0, 0, EK_CONFIG.width, EK_CONFIG.height);
  ctx.fillStyle = '#fff3d6';
  ekRoundRect(ctx, 340, 150, 600, 400, 18); ctx.fill();
  ctx.strokeStyle = EK_COLORS.gold; ctx.lineWidth = 4;
  ekRoundRect(ctx, 340, 150, 600, 400, 18); ctx.stroke();
  ekText(ctx, 'SHIFT OVER!', 640, 205, 44, '#d94f3d');
  ekText(ctx, 'Final score', 640, 262, 18, EK_COLORS.softInk);
  ekText(ctx, String(state.score), 640, 310, 56, EK_COLORS.ink);
  ekText(ctx, 'Dishes served: ' + state.served + '    Missed tickets: ' + state.missed, 640, 368, 18, EK_COLORS.ink);
  ekText(ctx, 'Best combo: x' + state.bestCombo, 640, 400, 18, EK_COLORS.ink);
  const verdict = state.score >= 1500 ? 'Head chef material!' :
    state.score >= 900 ? 'A solid shift, Chef.' :
    state.score >= 400 ? 'The kitchen survived you.' : 'The tickets won this time.';
  ekText(ctx, verdict, 640, 446, 19, '#2e7d32');
  ekText(ctx, 'Press R or click to cook again', 640, 500, 16, EK_COLORS.softInk);
}
