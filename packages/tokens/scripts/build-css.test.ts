import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { block, buildTokenCss, kebab, writeTokenCss } from './build-css';

describe('build-css', () => {
  it('converts camelCase token names to kebab-case CSS variable names', () => {
    expect(kebab('brandHover')).toBe('brand-hover');
    expect(block('color', { textMuted: '#71717a' })).toBe('  --color-text-muted: #71717a;');
  });

  it('emits light, dark, and reduced-motion token CSS', () => {
    const css = buildTokenCss();

    expect(css).toContain(':root {');
    expect(css).toContain('--color-background: #ffffff;');
    expect(css).toContain('--color-brand-hover: #4338ca;');
    expect(css).toContain("[data-theme='dark']");
    expect(css).toContain('--color-background: #18181b;');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('--duration-fast: 0ms;');
  });

  it('writes generated CSS to the requested output path', () => {
    const directory = mkdtempSync(join(tmpdir(), 'ship-it-tokens-'));
    const outputPath = join(directory, 'styles', 'tokens.css');

    writeTokenCss(outputPath);

    expect(readFileSync(outputPath, 'utf8')).toBe(buildTokenCss());
  });
});
