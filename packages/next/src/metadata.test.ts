import { describe, expect, it } from 'vitest';

import { buildMetadata } from './metadata';

describe('buildMetadata', () => {
  it('produces a minimal metadata object from just a title', () => {
    const m = buildMetadata({ title: 'Hello' });
    expect(m.title).toBe('Hello');
    expect(m.description).toBeUndefined();
    expect(m.openGraph).toMatchObject({ title: 'Hello', type: 'website', locale: 'en_US' });
    expect(m.twitter).toMatchObject({ card: 'summary', title: 'Hello' });
    expect(m.alternates).toBeUndefined();
    expect(m.robots).toEqual({ index: true, follow: true });
  });

  it('threads description through openGraph and twitter', () => {
    const m = buildMetadata({ title: 'T', description: 'D' });
    expect(m.description).toBe('D');
    expect((m.openGraph as { description?: string }).description).toBe('D');
    expect((m.twitter as { description?: string }).description).toBe('D');
  });

  it('sets alternates.canonical AND openGraph.url when url is provided', () => {
    const m = buildMetadata({ title: 'T', url: 'https://ship.it/x' });
    expect(m.alternates).toEqual({ canonical: 'https://ship.it/x' });
    expect((m.openGraph as { url?: string }).url).toBe('https://ship.it/x');
  });

  it('switches twitter card to summary_large_image when ogImage is supplied as a string', () => {
    const m = buildMetadata({ title: 'T', ogImage: 'https://ship.it/og.png' });
    expect(m.twitter).toMatchObject({ card: 'summary_large_image' });
    const ogImages = (m.openGraph as { images?: Array<{ url: string }> }).images;
    expect(ogImages).toEqual([{ url: 'https://ship.it/og.png' }]);
  });

  it('respects object-form ogImage with width/height/alt', () => {
    const m = buildMetadata({
      title: 'T',
      ogImage: { url: 'https://ship.it/og.png', width: 1200, height: 630, alt: 'Hero' },
    });
    const ogImages = (m.openGraph as { images?: Array<{ url: string; alt?: string }> }).images;
    expect(ogImages?.[0]).toMatchObject({ url: 'https://ship.it/og.png', alt: 'Hero' });
  });

  it('normalizes a twitterHandle (with or without leading @) to @handle', () => {
    const withAt = buildMetadata({ title: 'T', twitterHandle: '@shipit' });
    const without = buildMetadata({ title: 'T', twitterHandle: 'shipit' });
    expect((withAt.twitter as { creator?: string }).creator).toBe('@shipit');
    expect((without.twitter as { creator?: string }).creator).toBe('@shipit');
  });

  it('flips robots to noindex when noIndex is set', () => {
    const m = buildMetadata({ title: 'T', noIndex: true });
    expect(m.robots).toEqual({ index: false, follow: false });
  });

  it('passes through siteName and locale overrides', () => {
    const m = buildMetadata({ title: 'T', siteName: 'ShipIt', locale: 'fr_FR' });
    expect(m.openGraph).toMatchObject({ siteName: 'ShipIt', locale: 'fr_FR' });
  });
});
