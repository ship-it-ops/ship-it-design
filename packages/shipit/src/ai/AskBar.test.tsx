import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { AskBar } from './AskBar';

describe('AskBar', () => {
  it('disables submit when empty', () => {
    render(<AskBar />);
    expect(screen.getByRole('button', { name: 'Ask' })).toBeDisabled();
  });

  it('submits the typed value via the button', async () => {
    const onSubmit = vi.fn();
    render(<AskBar onSubmit={onSubmit} />);
    await userEvent.type(screen.getByRole('textbox'), 'Who is on-call?');
    await userEvent.click(screen.getByRole('button', { name: 'Ask' }));
    expect(onSubmit).toHaveBeenCalledWith('Who is on-call?');
  });

  it('submits on ⌘↵', async () => {
    const onSubmit = vi.fn();
    render(<AskBar onSubmit={onSubmit} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Recent rollbacks');
    await userEvent.keyboard('{Meta>}{Enter}{/Meta}');
    expect(onSubmit).toHaveBeenCalledWith('Recent rollbacks');
  });

  it('does not submit on plain Enter', async () => {
    const onSubmit = vi.fn();
    render(<AskBar onSubmit={onSubmit} />);
    await userEvent.type(screen.getByRole('textbox'), 'hi{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<AskBar placeholder="Ask anything…" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
