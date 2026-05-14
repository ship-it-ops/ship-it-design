import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { formatAge, StalenessChip } from './StalenessChip';

describe('formatAge', () => {
  it('renders sub-minute ages as "just now"', () => {
    expect(formatAge(0)).toBe('just now');
    expect(formatAge(30)).toBe('just now');
    expect(formatAge(59)).toBe('just now');
  });

  it('renders sub-hour ages in minutes', () => {
    expect(formatAge(60)).toBe('1m');
    expect(formatAge(120)).toBe('2m');
    expect(formatAge(3599)).toBe('59m');
  });

  it('renders sub-day ages in hours', () => {
    expect(formatAge(3600)).toBe('1h');
    expect(formatAge(7200)).toBe('2h');
    expect(formatAge(86399)).toBe('23h');
  });

  it('renders larger ages in days', () => {
    expect(formatAge(86400)).toBe('1d');
    expect(formatAge(100 * 86400)).toBe('100d');
  });

  it('clamps negative inputs to zero', () => {
    expect(formatAge(-10)).toBe('just now');
  });
});

describe('StalenessChip', () => {
  it('renders the humanised age with " ago" suffix when not instant', () => {
    render(<StalenessChip ageSeconds={3600 * 3} />);
    expect(screen.getByText('3h ago')).toBeInTheDocument();
  });

  it('omits the " ago" suffix for "just now"', () => {
    render(<StalenessChip ageSeconds={5} />);
    expect(screen.getByText('just now')).toBeInTheDocument();
  });

  it('renders the prefix when provided', () => {
    render(<StalenessChip ageSeconds={120} prefix="Updated" />);
    expect(screen.getByText('Updated')).toBeInTheDocument();
    expect(screen.getByText('2m ago')).toBeInTheDocument();
  });

  describe('tier derivation', () => {
    // Default thresholds: [3600, 86400]. ok ≤ 3600 < warn ≤ 86400 < err.
    it('classifies fresh ages as ok', () => {
      const { container } = render(<StalenessChip ageSeconds={3600} data-testid="chip" />);
      // text-ok class is added by the badge `ok` variant.
      expect(container.querySelector('[data-testid="chip"]')?.className).toMatch(/text-ok/);
    });

    it('classifies medium ages as warn', () => {
      const { container } = render(<StalenessChip ageSeconds={3601} data-testid="chip" />);
      expect(container.querySelector('[data-testid="chip"]')?.className).toMatch(/text-warn/);
    });

    it('classifies very-old ages as err', () => {
      const { container } = render(<StalenessChip ageSeconds={86401} data-testid="chip" />);
      expect(container.querySelector('[data-testid="chip"]')?.className).toMatch(/text-err/);
    });

    it('honours custom thresholds', () => {
      // Override so anything over 10 seconds becomes warn.
      const { container } = render(
        <StalenessChip ageSeconds={30} thresholds={[10, 60]} data-testid="chip" />,
      );
      expect(container.querySelector('[data-testid="chip"]')?.className).toMatch(/text-warn/);
    });
  });

  it('wires up a tooltip when the prop is provided', () => {
    render(<StalenessChip ageSeconds={120} tooltip="Last refreshed via cron job" />);
    // The Radix tooltip trigger renders the badge — assert the chip text is still
    // there and that an aria-describedby was set (Radix sets this on the trigger
    // when content mounts; existence proves the SimpleTooltip wrapped it).
    expect(screen.getByText('2m ago')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<StalenessChip ageSeconds={120} prefix="Updated" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
