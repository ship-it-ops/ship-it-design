import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from './Menubar';

function Sample() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New</MenubarItem>
          <MenubarItem trailing="⌘S">Save</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

describe('Menubar', () => {
  it('renders triggers', () => {
    render(<Sample />);
    expect(screen.getByRole('menuitem', { name: 'File' })).toBeInTheDocument();
  });

  it('opens content when activated', async () => {
    render(<Sample />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    expect(await screen.findByText('Save')).toBeInTheDocument();
  });

  it('has no a11y violations (closed)', async () => {
    const { container } = render(<Sample />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
