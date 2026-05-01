import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';

describe('ButtonGroup', () => {
  it('renders children inside a role=group container', () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Two' })).toBeInTheDocument();
  });

  it('omits the connecting border on the first child', () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    const [first, second] = screen.getAllByRole('button');
    expect(first).not.toHaveClass('border-l');
    expect(second).toHaveClass('border-l');
  });

  it('switches the seam to a top border in vertical orientation', () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    const [, second] = screen.getAllByRole('button');
    expect(second).toHaveClass('border-t');
    expect(second).not.toHaveClass('border-l');
  });

  it('skips non-element children (e.g., raw strings)', () => {
    render(
      <ButtonGroup>
        {'ignored-text'}
        <Button>Only</Button>
      </ButtonGroup>,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <ButtonGroup aria-label="View toggle">
        <Button>List</Button>
        <Button>Grid</Button>
      </ButtonGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
