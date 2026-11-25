// Ember Kitchen — input and layout. The kitchen's hit regions live
// here so the renderer and the click logic can never disagree about
// where a button is.
'use strict';

// All regions in the game's 1280x720 logical space.
const EK_LAYOUT = {
  topBar: { x: 0, y: 0, w: 1280, h: 58 },
  board: { x: 24, y: 68, w: 1232, h: 118 },
  ticketW: 292,
  ticketGap: 16,
  stove: { x: 40, y: 210, w: 330, h: 250 },
  burnerA: { x: 78, y: 300, w: 110, h: 110 },
  burnerB: { x: 222, y: 300, w: 110, h: 110 },
  plate: { x: 470, y: 240, w: 340, h: 220 },
  serveBtn: { x: 850, y: 250, w: 150, h: 64 },
  trashBtn: { x: 850, y: 330, w: 150, h: 64 },
  chef: { x: 1030, y: 210, w: 210, h: 250 },
  bins: { x: 24, y: 520, w: 1232, h: 176 },
  binW: 116,
  binGap: 8,
  handSlot: { x: 470, y: 470, w: 340, h: 36 },
};

function ekPointInRect(px, py, r) {
  return px >= r.x && px < r.x + r.w && py >= r.y && py < r.y + r.h;
}

function ekBinRect(i) {
  return {
    x: EK_LAYOUT.bins.x + i * (EK_LAYOUT.binW + EK_LAYOUT.binGap),
    y: EK_LAYOUT.bins.y,
    w: EK_LAYOUT.binW,
    h: EK_LAYOUT.bins.h,
  };
}

function ekTicketRect(i) {
  return {
    x: EK_LAYOUT.board.x + 8 + i * (EK_LAYOUT.ticketW + EK_LAYOUT.ticketGap),
    y: EK_LAYOUT.board.y + 10,
    w: EK_LAYOUT.ticketW,
    h: EK_LAYOUT.board.h - 20,
  };
}

const EK_Input = {
  mouse: { x: 0, y: 0, down: false },
  hoverBin: -1,
  hoverBurner: -1,
  hoverServe: false,
  hoverTrash: false,
  hoverPlate: false,

  // Translate a pointer event into logical game coordinates (the canvas
  // is scaled by CSS, so divide by its drawn size).
  toLogical(canvas, ev) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (ev.clientX - rect.left) * (EK_CONFIG.width / rect.width),
      y: (ev.clientY - rect.top) * (EK_CONFIG.height / rect.height),
    };
  },

  attach(canvas, onClick, onKey) {
    canvas.addEventListener('mousemove', (ev) => {
      const p = this.toLogical(canvas, ev);
      this.mouse.x = p.x;
      this.mouse.y = p.y;
      this.updateHover(p);
    });
    canvas.addEventListener('mousedown', (ev) => {
      const p = this.toLogical(canvas, ev);
      this.mouse.x = p.x;
      this.mouse.y = p.y;
      this.mouse.down = true;
      onClick(p.x, p.y);
    });
    window.addEventListener('mouseup', () => { this.mouse.down = false; });
    canvas.addEventListener('touchstart', (ev) => {
      ev.preventDefault();
      const touch = ev.changedTouches[0];
      const p = this.toLogical(canvas, touch);
      this.mouse.x = p.x;
      this.mouse.y = p.y;
      onClick(p.x, p.y);
    }, { passive: false });
    window.addEventListener('keydown', (ev) => {
      if (ev.repeat) return;
      onKey(ev.key.toLowerCase());
    });
  },

  updateHover(p) {
    this.hoverBin = -1;
    for (let i = 0; i < EK_BINS.length; i++) {
      if (ekPointInRect(p.x, p.y, ekBinRect(i))) { this.hoverBin = i; break; }
    }
    this.hoverBurner = -1;
    if (ekPointInRect(p.x, p.y, EK_LAYOUT.burnerA)) this.hoverBurner = 0;
    if (ekPointInRect(p.x, p.y, EK_LAYOUT.burnerB)) this.hoverBurner = 1;
    this.hoverServe = ekPointInRect(p.x, p.y, EK_LAYOUT.serveBtn);
    this.hoverTrash = ekPointInRect(p.x, p.y, EK_LAYOUT.trashBtn);
    this.hoverPlate = ekPointInRect(p.x, p.y, EK_LAYOUT.plate);
  },
};
