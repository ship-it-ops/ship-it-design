import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DateTime } from './DateTime';

describe('DateTime', () => {
  it('renders a <time> element with the ISO string as dateTime', () => {
    render(<DateTime iso="2026-05-03">May 3, 2026</DateTime>);
    const time = screen.getByText('May 3, 2026');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('datetime', '2026-05-03');
  });

  it('accepts a Date object and serializes via toISOString()', () => {
    const date = new Date('2026-05-03T12:34:56Z');
    render(<DateTime iso={date}>3 May</DateTime>);
    expect(screen.getByText('3 May')).toHaveAttribute('datetime', '2026-05-03T12:34:56.000Z');
  });

  it('falls back to the ISO string when no children are supplied', () => {
    render(<DateTime iso="2026-05-03" data-testid="t" />);
    expect(screen.getByTestId('t')).toHaveTextContent('2026-05-03');
  });

  it('forwards className and other time-element props', () => {
    render(
      <DateTime iso="2026-05-03" className="text-text-dim" data-testid="t">
        x
      </DateTime>,
    );
    expect(screen.getByTestId('t')).toHaveClass('text-text-dim');
  });
});
