// Ember Kitchen — the food. Ingredients, recipes, and order dealing.
// A dish is a multiset of ingredient ids; anything that must be cooked
// is stored raw in the recipe and matched against its cooked form.
'use strict';

// Bin order along the counter (keys 1..9, 0). Cookable raws are listed
// with their cooked twin so the stove knows what to do with them.
const EK_BINS = [
  { id: 'bun',      key: '1', cookable: false },
  { id: 'patty',    key: '2', cookable: true,  cooked: 'pattyCooked' },
  { id: 'pasta',    key: '3', cookable: true,  cooked: 'pastaCooked' },
  { id: 'egg',      key: '4', cookable: true,  cooked: 'eggCooked' },
  { id: 'lettuce',  key: '5', cookable: false },
  { id: 'tomato',   key: '6', cookable: false },
  { id: 'cheese',   key: '7', cookable: false },
  { id: 'mushroom', key: '8', cookable: false },
  { id: 'broth',    key: '9', cookable: false },
  { id: 'chili',    key: '0', cookable: false },
];

const EK_RECIPES = [
  { name: 'Sunny Burger',  items: ['bun', 'pattyCooked', 'lettuce', 'tomato'], color: '#e8a13c' },
  { name: 'Forest Salad',  items: ['lettuce', 'tomato', 'mushroom', 'cheese'], color: '#69b455' },
  { name: 'Ember Pasta',   items: ['pastaCooked', 'tomato', 'cheese', 'chili'], color: '#d94f3d' },
  { name: 'Golden Soup',   items: ['broth', 'mushroom', 'eggCooked'], color: '#c98a3e' },
  { name: 'Morning Plate', items: ['eggCooked', 'cheese', 'tomato'], color: '#f7c948' },
  { name: 'Shroom Melt',   items: ['bun', 'mushroom', 'cheese'], color: '#b09a7a' },
  { name: 'Spicy Sunrise', items: ['eggCooked', 'chili', 'cheese'], color: '#c93a2e' },
  { name: 'Garden Stack',  items: ['bun', 'lettuce', 'tomato', 'cheese'], color: '#4c9a4c' },
];

// The raw id a cooked item came from, so the plate can tell the player
// what they are holding in plain words.
function ekCookedFrom(rawId) {
  const bin = EK_BINS.find((b) => b.id === rawId);
  return bin && bin.cooked ? bin.cooked : null;
}

function ekRawOf(cookedId) {
  const bin = EK_BINS.find((b) => b.cooked === cookedId);
  return bin ? bin.id : null;
}

function ekIsCookable(rawId) {
  const bin = EK_BINS.find((b) => b.id === rawId);
  return !!(bin && bin.cookable);
}

// Deal a new order: a random recipe, patience scaled by how far into
// the shift we are (orders get less patient as the rush builds).
function ekDealOrder(state) {
  const progress = 1 - state.timeLeft / EK_CONFIG.shiftSeconds;
  const recipe = EK_RECIPES[Math.floor(Math.random() * EK_RECIPES.length)];
  const patience = EK_CONFIG.patienceStart +
    (EK_CONFIG.patienceEnd - EK_CONFIG.patienceStart) * progress;
  return {
    id: state.nextOrderId++,
    dish: recipe.name,
    items: recipe.items.slice(),
    color: recipe.color,
    patience: patience,
    maxPatience: patience,
  };
}

function ekNextOrderDelay(state) {
  const progress = 1 - state.timeLeft / EK_CONFIG.shiftSeconds;
  return EK_CONFIG.orderIntervalStart +
    (EK_CONFIG.orderIntervalEnd - EK_CONFIG.orderIntervalStart) * progress;
}

// Multiset equality: the plate matches an order when it holds exactly
// the same ingredients, no more, no fewer, in any order.
function ekPlateMatchesOrder(plate, order) {
  if (plate.length !== order.items.length) return false;
  const rest = order.items.slice();
  for (const item of plate) {
    const i = rest.indexOf(item);
    if (i < 0) return false;
    rest.splice(i, 1);
  }
  return rest.length === 0;
}
