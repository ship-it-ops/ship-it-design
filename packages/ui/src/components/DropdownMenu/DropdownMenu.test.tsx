import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  MenuItem,
  MenuSeparator,
} from './DropdownMenu';

const Sample = () => (
  <DropdownMenu>
    <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
    <DropdownMenuContent>
      <MenuItem>Open</MenuItem>
      <MenuSeparator />
      <MenuItem destructive>Delete</MenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

describe('DropdownMenu', () => {
  it('opens on trigger click', async () => {
    render(<Sample />);
    expect(screen.queryByText('Open')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Actions'));
    expect(await screen.findByText('Open')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Sample />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
