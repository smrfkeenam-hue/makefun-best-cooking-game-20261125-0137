// Ember Kitchen — tuning and palette. One job: every number the game
// balances on, and every colour it paints with, lives here.
'use strict';

const EK_CONFIG = {
  title: 'Ember Kitchen',
  chef: 'Chef Mira',
  width: 1280,
  height: 720,
  shiftSeconds: 180,
  rushAtSecondsLeft: 60,
  maxOrders: 4,
  firstOrderDelay: 1.2,
  orderIntervalStart: 14,
  orderIntervalEnd: 8.5,
  patienceStart: 48,
  patienceEnd: 30,
  cookTime: { patty: 4, pasta: 5, egg: 3 },
  burnGrace: 5,
  serveBase: 100,
  serveTipMax: 50,
  comboStep: 0.1,
  comboCap: 2.0,
  missPenalty: 0,
};

const EK_COLORS = {
  wallTop: '#f7e8c9',
  wallBottom: '#efd9ae',
  floorA: '#c98f5f',
  floorB: '#bd8252',
  board: '#8a5a33',
  boardEdge: '#6e4525',
  ticket: '#fff8e6',
  ticketEdge: '#e0c98f',
  counter: '#a06a3b',
  counterTop: '#c08a52',
  stove: '#4a4a52',
  stoveTop: '#33333a',
  plate: '#ffffff',
  plateEdge: '#d9d9d9',
  ink: '#3a2a1a',
  softInk: '#7a5c3e',
  red: '#d94f3d',
  green: '#4c9a4c',
  gold: '#e8a13c',
  cream: '#fff3d6',
};

// Ingredient look: a base fill, a darker rim, and a tiny glyph drawn
// with plain shapes (no emoji — headless fonts vary, shapes do not).
const EK_INGREDIENT_STYLE = {
  bun:      { fill: '#e8b96a', rim: '#b98a3e', label: 'Bun' },
  patty:    { fill: '#7a4a26', rim: '#54331a', label: 'Patty' },
  pattyCooked: { fill: '#8a5a2e', rim: '#5d3c1c', label: 'Patty' },
  pasta:    { fill: '#f2d06b', rim: '#c9a13c', label: 'Pasta' },
  pastaCooked: { fill: '#f7dc8a', rim: '#d9b45a', label: 'Pasta' },
  egg:      { fill: '#fdf6e3', rim: '#d9cba6', label: 'Egg' },
  eggCooked: { fill: '#fff8d0', rim: '#e0c860', label: 'Egg' },
  lettuce:  { fill: '#69b455', rim: '#3f7d33', label: 'Lettuce' },
  tomato:   { fill: '#e05252', rim: '#a83232', label: 'Tomato' },
  cheese:   { fill: '#f7c948', rim: '#d9a41f', label: 'Cheese' },
  mushroom: { fill: '#e8dcc8', rim: '#b09a7a', label: 'Shroom' },
  broth:    { fill: '#c98a3e', rim: '#8a5a1f', label: 'Broth' },
  chili:    { fill: '#c93a2e', rim: '#8a1f16', label: 'Chili' },
  burned:   { fill: '#2e2a26', rim: '#171412', label: 'Burnt!' },
};
