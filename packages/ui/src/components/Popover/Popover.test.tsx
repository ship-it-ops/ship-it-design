import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Popover, PopoverContent, PopoverTrigger } from './Popover';

const Sample = () => (
  <Popover>
    <PopoverTrigger>Open</PopoverTrigger>
    <PopoverContent>Hi</PopoverContent>
  </Popover>
);

describe('Popover', () => {
  it('opens on trigger click', async () => {
    render(<Sample />);
    expect(screen.queryByText('Hi')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Open'));
    expect(screen.getByText('Hi')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Sample />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
