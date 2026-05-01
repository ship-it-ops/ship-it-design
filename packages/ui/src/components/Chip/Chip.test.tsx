import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Chip } from './Chip';

describe('Chip', () => {
  it('renders', () => {
    render(<Chip>filter</Chip>);
    expect(screen.getByText('filter')).toBeInTheDocument();
  });

  it('renders the leading icon slot', () => {
    render(<Chip icon={<span data-testid="cicon">@</span>}>username</Chip>);
    expect(screen.getByTestId('cicon')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Chip removable onRemove={() => {}}>
        tag
      </Chip>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
