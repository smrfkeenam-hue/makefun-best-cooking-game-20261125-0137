// Ember Kitchen — the hand-in. Copies game/ and screenshots/ from this
// repository into the output directory and writes the dossier the
// scorer rebuilds with the same library, byte for byte.
import { buildDossier } from './vendor/makefun-game.ts';
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'game'), join(outDir, 'game'), { recursive: true });
cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);

// Sanity: the output must hold the game, the screenshots and the dossier.
const shotCount = readdirSync(join(outDir, 'screenshots')).filter((n) => !n.startsWith('.')).length;
if (shotCount < 3 || shotCount > 4) {
  throw new Error('Ember Kitchen: expected 3 or 4 screenshots, found ' + shotCount);
}

console.log('Ember Kitchen handed in: game/, ' + shotCount + ' screenshots, dossier.json written to ' + outDir);
