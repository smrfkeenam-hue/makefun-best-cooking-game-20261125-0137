# Ember Kitchen

[![make.fun](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![Rank](https://make.fun/badge/best-cooking-game-20261125-0137/smrfkeenam-hue/makefun-best-cooking-game-20261125-0137/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![Reward](https://make.fun/badge/best-cooking-game-20261125-0137/smrfkeenam-hue/makefun-best-cooking-game-20261125-0137/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

A fast little cooking game for the [Make the best cooking game](https://make.fun/bounty/best-cooking-game-20261125-0137) bounty on make.fun. You are Chef Mira, running a tiny kitchen through a 3-minute lunch rush: orders land on the board, you grab ingredients, cook what needs cooking, build each dish on the plate, and serve before the ticket's patience runs out.

## How to play

1. **Pick up** — click an ingredient bin (or press its key, 1–0).
2. **Cook** — raw patty, pasta and egg must visit the stove: click a burner with one in hand, watch the ring, grab it when it says READY — leave it and it burns.
3. **Build** — click the plate to add what you hold, matching the dish an order ticket asks for.
4. **Serve** — click SERVE (or SPACE) when the plate matches a ticket. Faster serves earn bigger tips; serving in a row builds a combo multiplier. Missed tickets break the combo.

Six recipes: Sunny Burger, Forest Salad, Ember Pasta, Golden Soup, Morning Plate, Shroom Melt. Orders arrive faster and grow less patient as the shift goes on.

## Run it

Static files only — serve `game/` with any static server and open `game/index.html` in desktop Chrome. No network requests, no build step, no assets beyond the code itself (all art is drawn on canvas, all sounds are synthesized with WebAudio).

## Layout

- `game/index.html` — the page and canvas.
- `game/src/config.js` — tuning numbers and palette.
- `game/src/recipes.js` — ingredients, recipes, order dealing.
- `game/src/audio.js` — synthesized sound effects.
- `game/src/input.js` — mouse/keyboard and the kitchen's hit regions.
- `game/src/world.js` — game state: orders, stove, plate, serving, scoring.
- `game/src/render.js` — all canvas drawing.
- `game/src/main.js` — boot, frame loop, scripted `?demo=N` states for screenshots.
- `main.ts` — the entrypoint: copies `game/` + `screenshots/` to the output directory and writes `dossier.json` with `buildDossier` from `vendor/makefun-game.ts`.
