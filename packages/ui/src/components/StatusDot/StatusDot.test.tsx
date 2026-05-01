import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { StatusDot } from './StatusDot';

describe('StatusDot', () => {
  it('exposes a status role with the label', () => {
    render(<StatusDot state="ok" label="Synced" />);
    expect(screen.getByRole('status')).toHaveTextContent('Synced');
  });

  it('falls back to img role with the state name when no label', () => {
    render(<StatusDot state="warn" />);
    expect(screen.getByRole('img', { name: 'warn' })).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<StatusDot state="ok" label="Synced" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
