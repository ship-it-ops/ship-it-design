import { describe, expect, it } from 'vitest';

import { isValidCssColor } from './validate';

describe('isValidCssColor', () => {
  it.each([
    '#fff',
    '#ffffff',
    '#ffffffff',
    'rgb(0, 0, 0)',
    'rgba(0,0,0,0.5)',
    'hsl(200, 50%, 50%)',
    'oklch(0.5 0.1 200)',
    'oklab(0.5 0.1 -0.1)',
    'lab(50 20 -30)',
    'lch(50 30 200)',
    'color(display-p3 1 0 0)',
    'color-mix(in oklab, oklch(0.7 0.1 200), #fff 20%)',
    'transparent',
    'currentColor',
    'red',
  ])('accepts %s', (value) => {
    expect(isValidCssColor(value)).toBe(true);
  });

  it.each(['', '   ', 'not-a-color', '#ggg', '#1234567', 'rgb(', 'oklch(0.5'])(
    'rejects %s',
    (value) => {
      expect(isValidCssColor(value)).toBe(false);
    },
  );
});
