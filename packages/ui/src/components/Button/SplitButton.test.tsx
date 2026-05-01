import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { SplitButton } from './SplitButton';

describe('SplitButton', () => {
  it('renders the main label and the menu chevron', () => {
    render(<SplitButton>Deploy</SplitButton>);
    expect(screen.getByRole('button', { name: 'Deploy' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument();
  });

  it('routes click events to the correct segment', async () => {
    const onClick = vi.fn();
    const onMenu = vi.fn();
    render(
      <SplitButton onClick={onClick} onMenu={onMenu}>
        Deploy
      </SplitButton>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Deploy' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onMenu).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'More actions' }));
    expect(onMenu).toHaveBeenCalledOnce();
  });

  it('disables both segments when disabled', () => {
    render(<SplitButton disabled>Deploy</SplitButton>);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((b) => expect(b).toBeDisabled());
  });

  it('has no a11y violations', async () => {
    const { container } = render(<SplitButton>Deploy</SplitButton>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
