import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Chip } from './Chip';

describe('Chip', () => {
  it('renders', () => {
    render(<Chip>filter</Chip>);
    expect(screen.getByText('filter')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Chip removable onRemove={() => {}}>tag</Chip>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
