import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { GraphNodeShell } from './GraphNodeShell';

describe('GraphNodeShell', () => {
  it('renders with role=img and a string label as the accessible name', () => {
    render(<GraphNodeShell type="service" label="api-gateway" />);
    expect(screen.getByRole('img', { name: 'api-gateway' })).toBeInTheDocument();
  });

  it('falls back to "${type} node" when no label is provided', () => {
    render(<GraphNodeShell type="incident" />);
    expect(screen.getByRole('img', { name: 'incident node' })).toBeInTheDocument();
  });

  it('drops role=img and aria-label when label is a ReactNode so the child element owns the name', () => {
    render(
      <GraphNodeShell
        type="service"
        label={<button aria-label="Edit api-gateway">api-gateway</button>}
      />,
    );
    // No `role="img"` in this branch — a nameless image would fail
    // axe's `role-img-alt` rule, and the child button is self-describing.
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit api-gateway' })).toBeInTheDocument();
  });

  it.each(['default', 'hover', 'selected', 'path', 'dim'] as const)(
    'reflects state=%s on data-state',
    (state) => {
      const { container } = render(<GraphNodeShell type="service" label="x" state={state} />);
      expect(container.querySelector('[data-state]')).toHaveAttribute('data-state', state);
    },
  );

  it('has no a11y violations with a string label', async () => {
    const { container } = render(<GraphNodeShell type="service" label="api-gateway" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations with a ReactNode label', async () => {
    const { container } = render(
      <GraphNodeShell type="service" label={<span>api-gateway</span>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations with no label', async () => {
    const { container } = render(<GraphNodeShell type="document" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
