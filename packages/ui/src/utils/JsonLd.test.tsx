import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { JsonLd } from './JsonLd';

describe('JsonLd', () => {
  it('renders a single application/ld+json script with the serialized payload', () => {
    const data = { '@context': 'https://schema.org', '@type': 'Thing', name: 'X' };
    const { container } = render(<JsonLd data={data} />);
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(1);
    expect(JSON.parse(scripts[0]!.textContent ?? '')).toEqual(data);
  });

  it('renders nothing when data is null or undefined', () => {
    const { container, rerender } = render(<JsonLd data={null} />);
    expect(container.querySelector('script')).toBeNull();
    rerender(<JsonLd data={undefined} />);
    expect(container.querySelector('script')).toBeNull();
  });

  it('escapes `</script>` so injected substrings cannot break out of the script tag', () => {
    const { container } = render(
      <JsonLd data={{ payload: '</script><img onerror="alert(1)">' }} />,
    );
    const script = container.querySelector('script[type="application/ld+json"]')!;
    const raw = script.innerHTML;
    // Literal `</script>` must not appear in the script body.
    expect(raw).not.toMatch(/<\/script>/i);
    // Escaped form must.
    expect(raw).toContain('\\u003c/script>');
    // Round-trip still parses, and the original character sequence is recovered.
    expect(JSON.parse(script.textContent ?? '').payload).toBe('</script><img onerror="alert(1)">');
  });

  it('serializes arrays of entities (the common multi-item pattern)', () => {
    const data = [
      { '@type': 'A', name: 'a' },
      { '@type': 'B', name: 'b' },
    ];
    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(JSON.parse(script.textContent ?? '')).toEqual(data);
  });
});
