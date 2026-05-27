import { describe, expect, it } from 'vitest';

import { block, blockNoPrefix, buildTokenCss, kebab } from './emit-css';

describe('emit-css (extracted module)', () => {
  it('exports kebab', () => {
    expect(kebab('borderStrong')).toBe('border-strong');
  });

  it('exports block', () => {
    expect(block('color', { textMuted: '#8a8a94' })).toBe('  --color-text-muted: #8a8a94;');
  });

  it('exports blockNoPrefix', () => {
    expect(blockNoPrefix({ rowH: '56px' })).toBe('  --row-h: 56px;');
  });

  it('exports buildTokenCss that emits the full token set', () => {
    const css = buildTokenCss();
    expect(css).toContain(':root {');
    expect(css).toContain('--color-bg:');
    expect(css).toContain("[data-theme='light']");
  });
});
