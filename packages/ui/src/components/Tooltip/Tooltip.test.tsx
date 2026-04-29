import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders the trigger', () => {
    render(
      <Tooltip content="Add">
        <button>+</button>
      </Tooltip>,
    );
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Tooltip content="Add">
        <button>+</button>
      </Tooltip>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
