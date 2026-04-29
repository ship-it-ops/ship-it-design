import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('exposes a default loading label', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('honours a custom label', () => {
    render(<Spinner label="Indexing repos" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Indexing repos');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
