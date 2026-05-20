import { describe, expect, it } from 'vitest';

import { iconToSvgDataUrl } from './icon-to-data-url';

describe('iconToSvgDataUrl', () => {
  it('emits SVG with explicit width and height for a registered icon', () => {
    const url = iconToSvgDataUrl('service', { size: 52, color: '#5b9cff' });
    expect(url.startsWith('data:image/svg+xml;utf8,')).toBe(true);
    const decoded = decodeURIComponent(url.slice('data:image/svg+xml;utf8,'.length));
    // viewBox-only SVG paints as 0×0 when used as <img> background — explicit
    // width/height attributes are mandatory.
    expect(decoded).toMatch(/width='52'/);
    expect(decoded).toMatch(/height='52'/);
    expect(decoded).toMatch(/viewBox='\d+ \d+ \d+ \d+'/);
    expect(decoded).toContain("fill='#5b9cff'");
    expect(decoded).toMatch(/<(path|g)/);
  });

  it('sets `style="color:…"` on the wrapper so stroke="currentColor" icons paint in the requested color', () => {
    // Lucide bodies use `stroke="currentColor"` with `fill="none"`. Inside an
    // `<img>` background-image the SVG has no inherited `color` cascade, so
    // `currentColor` resolves to the user-agent default (black) unless the
    // wrapper explicitly sets `color`. This test guards the dark-theme
    // regression where node glyphs rendered black against a dark background.
    const url = iconToSvgDataUrl('service', { size: 52, color: '#5b9cff' });
    const decoded = decodeURIComponent(url.slice('data:image/svg+xml;utf8,'.length));
    expect(decoded).toContain("style='color:#5b9cff'");
  });

  it('resolves connector names via the `connector:` namespace', () => {
    const url = iconToSvgDataUrl('connector:github');
    const decoded = decodeURIComponent(url.slice('data:image/svg+xml;utf8,'.length));
    expect(decoded).toMatch(/<path/);
    expect(decoded).not.toContain('<text');
  });

  it('falls back to centered <text> for unregistered names (e.g. raw unicode glyph)', () => {
    const url = iconToSvgDataUrl('◇', { size: 48, color: '#fff' });
    const decoded = decodeURIComponent(url.slice('data:image/svg+xml;utf8,'.length));
    expect(decoded).toContain('<text');
    expect(decoded).toContain('>◇<');
    expect(decoded).toContain("text-anchor='middle'");
    expect(decoded).toMatch(/width='48'/);
    expect(decoded).toMatch(/height='48'/);
  });

  it('escapes hostile glyph characters in the fallback', () => {
    const url = iconToSvgDataUrl('<script>', { size: 24 });
    const decoded = decodeURIComponent(url.slice('data:image/svg+xml;utf8,'.length));
    expect(decoded).toContain('&lt;script&gt;');
    expect(decoded).not.toContain('<script>');
  });

  it('defaults to size 52 and color #000 when options are omitted', () => {
    const url = iconToSvgDataUrl('service');
    const decoded = decodeURIComponent(url.slice('data:image/svg+xml;utf8,'.length));
    expect(decoded).toMatch(/width='52'/);
    expect(decoded).toContain("fill='#000'");
  });
});
