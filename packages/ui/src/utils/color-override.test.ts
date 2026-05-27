import { describe, expect, it, vi } from 'vitest';

import { tintStyle, warnIfInvalidColor } from './color-override';

describe('tintStyle', () => {
  it('returns a 15%-tint background and full-color text style', () => {
    expect(tintStyle('#7c3aed')).toEqual({
      background: 'color-mix(in oklab, #7c3aed, transparent 85%)',
      color: '#7c3aed',
    });
  });
});

describe('warnIfInvalidColor', () => {
  it('warns when the value is not a valid CSS color and returns false', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(warnIfInvalidColor('not-a-color', 'Badge')).toBe(false);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[Badge]'));
    spy.mockRestore();
  });

  it('does not warn when the value is valid and returns true', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(warnIfInvalidColor('#7c3aed', 'Badge')).toBe(true);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
