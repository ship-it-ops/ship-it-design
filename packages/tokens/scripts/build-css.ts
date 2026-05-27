/**
 * Generates `styles/tokens.css` from the TypeScript token modules.
 * Thin caller — the emitter logic lives in `src/emit-css.ts` and is shared
 * with the consumer `shipit` CLI.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildTokenCss } from '../src/emit-css.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '../styles/tokens.css');

export const writeTokenCss = (outputPath: string = OUTPUT_PATH): void => {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, buildTokenCss(), 'utf8');
};

// Re-export for back-compat with existing tests that import from this path.
export { block, blockNoPrefix, buildTokenCss, kebab, shadowBlock } from '../src/emit-css.js';

/* v8 ignore next 3 */
if (import.meta.url === `file://${process.argv[1]}`) {
  writeTokenCss();
  console.log(`✓ wrote ${OUTPUT_PATH}`);
}
