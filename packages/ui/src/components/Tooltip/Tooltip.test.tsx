import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { SimpleTooltip } from './Tooltip';

describe('SimpleTooltip', () => {
  it('renders the trigger', () => {
    render(
      <SimpleTooltip content="Add">
        <button>+</button>
      </SimpleTooltip>,
    );
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <SimpleTooltip content="Add">
        <button>+</button>
      </SimpleTooltip>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
