import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Breadcrumbs, Crumb } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('marks the last crumb as current', () => {
    render(
      <Breadcrumbs>
        <Crumb href="/">Workspace</Crumb>
        <Crumb href="/graph">Graph</Crumb>
        <Crumb>payment-webhook</Crumb>
      </Breadcrumbs>,
    );
    expect(screen.getByText('payment-webhook')).toHaveAttribute('aria-current', 'page');
  });

  it('earlier crumbs render as links', () => {
    render(
      <Breadcrumbs>
        <Crumb href="/">Workspace</Crumb>
        <Crumb href="/graph">Graph</Crumb>
        <Crumb>payment-webhook</Crumb>
      </Breadcrumbs>,
    );
    expect(screen.getByRole('link', { name: 'Workspace' })).toHaveAttribute('href', '/');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Breadcrumbs>
        <Crumb href="/">Home</Crumb>
        <Crumb>Page</Crumb>
      </Breadcrumbs>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
