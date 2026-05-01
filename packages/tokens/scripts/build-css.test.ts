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

  it('emits dark-default :root, light-overrides, and reduced-motion blocks', () => {
    const css = buildTokenCss();

    expect(css).toContain(':root {');
    expect(css).toContain('--accent-h: 200');
    expect(css).toContain('--color-bg: #0a0a0b;');
    expect(css).toContain("[data-theme='light']");
    expect(css).toContain('--color-bg: #fbfbfa;');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('--duration-micro: 0ms;');
    expect(css).toContain('--duration-step: 0ms;');
  });

  it('writes generated CSS to the requested output path', () => {
    const directory = mkdtempSync(join(tmpdir(), 'ship-it-tokens-'));
    const outputPath = join(directory, 'styles', 'tokens.css');

    writeTokenCss(outputPath);

    expect(readFileSync(outputPath, 'utf8')).toBe(buildTokenCss());
  });
});
