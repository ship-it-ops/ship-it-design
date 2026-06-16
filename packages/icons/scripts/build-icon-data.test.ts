import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { glyphManifest, logoManifest } from '../src/icon-manifest';
import { buildIconData, formatIconData, resolveIcon } from './build-icon-data';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICON_DATA_FILE = resolve(__dirname, '../src/icon-data.ts');

describe('build-icon-data', () => {
  it('committed icon-data.ts is byte-identical to a fresh regenerate', async () => {
    // Regression for "edit the manifest, forget to run codegen, ship stale
    // icons" — CI now catches that drift before merge. We compare against the
    // Prettier-formatted output (same formatter that pre-commit hooks /
    // editor save runs against the committed file) so this test agrees with
    // what's actually on disk.
    const committed = readFileSync(ICON_DATA_FILE, 'utf8');
    const fresh = await formatIconData(ICON_DATA_FILE, buildIconData());
    expect(fresh).toBe(committed);
  });

  it('every glyph manifest entry resolves to a non-empty SVG body', () => {
    for (const [name, ref] of Object.entries(glyphManifest)) {
      const data = resolveIcon(ref);
      expect(data.body, `${name} → ${ref[0]}:${ref[1]}`).toMatch(/<\w/);
      expect(data.viewBox).toMatch(/^\d+ \d+ \d+ \d+$/);
    }
  });

  it('every logo manifest entry resolves to a non-empty SVG body', () => {
    for (const [name, ref] of Object.entries(logoManifest)) {
      const data = resolveIcon(ref);
      expect(data.body, `${name} → ${ref[0]}:${ref[1]}`).toMatch(/<\w/);
      expect(data.viewBox).toMatch(/^\d+ \d+ \d+ \d+$/);
    }
  });
});
