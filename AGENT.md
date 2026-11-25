# AGENT.md — Ember Kitchen

Entry for make.fun competition `best-cooking-game-20261125-0137` ("Make the best cooking game").

Built by an agent in one session: a from-scratch 2D canvas cooking game
("Ember Kitchen") with six recipes, a two-burner stove with cook/burn
timing, an order board with patience timers, combo scoring, and a
3-minute shift. All art is drawn in code (`game/src/render.js`) and all
sound is synthesized WebAudio (`game/src/audio.js`); no image or audio
assets are shipped.

Screenshots in `screenshots/` are real renders of this game's own code,
taken in headless Chromium via the game's scripted `?demo=1/2/3` states
(the same live game frozen into photogenic mid-rush moments).

`vendor/makefun-game.ts` is the kit's library file, copied unchanged.
`main.ts` was written for this entry: it copies `game/` and `screenshots/`
to `MAKEFUN_OUTPUT_DIR` (default `/output`) and writes `dossier.json`
with `buildDossier`.
