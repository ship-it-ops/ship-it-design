import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { connectorManifest, glyphManifest } from '../src/icon-manifest';
import { buildIconData, renderIconDataModule, resolveIcon } from './build-icon-data';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICON_DATA_FILE = resolve(__dirname, '../src/icon-data.ts');

describe('build-icon-data', () => {
  it('committed icon-data.ts is byte-identical to a fresh regenerate', () => {
    // Regression for "edit the manifest, forget to run codegen, ship stale
    // icons" — CI now catches that drift before merge.
    const committed = readFileSync(ICON_DATA_FILE, 'utf8');
    const fresh = renderIconDataModule(buildIconData());
    expect(fresh).toBe(committed);
  });

  it('every glyph manifest entry resolves to a non-empty SVG body', () => {
    for (const [name, ref] of Object.entries(glyphManifest)) {
      const data = resolveIcon(ref);
      expect(data.body, `${name} → ${ref[0]}:${ref[1]}`).toMatch(/<\w/);
      expect(data.viewBox).toMatch(/^\d+ \d+ \d+ \d+$/);
    }
  });

  it('every connector manifest entry resolves to a non-empty SVG body', () => {
    for (const [name, ref] of Object.entries(connectorManifest)) {
      const data = resolveIcon(ref);
      expect(data.body, `${name} → ${ref[0]}:${ref[1]}`).toMatch(/<\w/);
      expect(data.viewBox).toMatch(/^\d+ \d+ \d+ \d+$/);
    }
  });
});
