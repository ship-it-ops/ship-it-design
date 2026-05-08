import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { block, buildTokenCss, kebab, writeTokenCss } from './build-css';

describe('build-css', () => {
  it('converts camelCase token names to kebab-case CSS variable names', () => {
    expect(kebab('borderStrong')).toBe('border-strong');
    expect(block('color', { textMuted: '#8a8a94' })).toBe('  --color-text-muted: #8a8a94;');
  });

  // Snapshot of the full generated CSS. Any unintended drift in token names
  // or values — added/removed/renamed/recomputed — fails this test. To accept
  // an intended change, re-run with `pnpm test -- -u` and verify the diff.
  it('matches the generated tokens.css snapshot', () => {
    expect(buildTokenCss()).toMatchSnapshot();
  });

  it('writes generated CSS to the requested output path', () => {
    const directory = mkdtempSync(join(tmpdir(), 'ship-it-tokens-'));
    const outputPath = join(directory, 'styles', 'tokens.css');

    writeTokenCss(outputPath);

    expect(readFileSync(outputPath, 'utf8')).toBe(buildTokenCss());
  });
});
