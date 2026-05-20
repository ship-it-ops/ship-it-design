import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { InlineEdit, type InlineEditHandle } from './InlineEdit';

describe('InlineEdit', () => {
  it('renders the value in display mode', () => {
    render(<InlineEdit value="api-gateway" onValueChange={() => {}} />);
    expect(screen.getByRole('button', { name: /edit api-gateway/i })).toHaveTextContent(
      'api-gateway',
    );
  });

  it('renders the placeholder when value is empty', () => {
    render(<InlineEdit value="" onValueChange={() => {}} placeholder="Untitled" />);
    expect(screen.getByRole('button')).toHaveTextContent('Untitled');
    expect(screen.getByRole('button')).toHaveAttribute('data-empty', 'true');
  });

  it('enters edit mode on double-click and commits on Enter', async () => {
    const handle = vi.fn();
    render(<InlineEdit value="payments" onValueChange={handle} />);
    const display = screen.getByRole('button');
    await userEvent.dblClick(display);
    const input = screen.getByRole('textbox');
    expect(input).toHaveFocus();
    expect(input).toHaveValue('payments');
    await userEvent.clear(input);
    await userEvent.type(input, 'payments-v2{Enter}');
    expect(handle).toHaveBeenCalledWith('payments-v2');
  });

  it('cancels with Escape and restores the original value', async () => {
    const handle = vi.fn();
    render(<InlineEdit value="ledger" onValueChange={handle} />);
    await userEvent.dblClick(screen.getByRole('button'));
    const input = screen.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'ledger-temp{Escape}');
    expect(handle).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveTextContent('ledger');
  });

  it('commits on blur by default', async () => {
    const handle = vi.fn();
    render(
      <>
        <InlineEdit value="auth" onValueChange={handle} />
        <button>elsewhere</button>
      </>,
    );
    await userEvent.dblClick(screen.getByRole('button', { name: /edit auth/i }));
    const input = screen.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'auth-v2');
    await userEvent.click(screen.getByRole('button', { name: 'elsewhere' }));
    expect(handle).toHaveBeenCalledWith('auth-v2');
  });

  it('reverts on blur when commitOnBlur is false', async () => {
    const handle = vi.fn();
    render(
      <>
        <InlineEdit value="notifications" onValueChange={handle} commitOnBlur={false} />
        <button>elsewhere</button>
      </>,
    );
    await userEvent.dblClick(screen.getByRole('button', { name: /edit notifications/i }));
    const input = screen.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'shadow-write');
    await userEvent.click(screen.getByRole('button', { name: 'elsewhere' }));
    expect(handle).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /edit notifications/i })).toHaveTextContent(
      'notifications',
    );
  });

  it('rejects an invalid value and stays in edit mode', async () => {
    const handle = vi.fn();
    const validate = (next: string) => (next.length < 3 ? 'too short' : null);
    render(<InlineEdit value="search" onValueChange={handle} validate={validate} />);
    await userEvent.dblClick(screen.getByRole('button'));
    const input = screen.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'ab{Enter}');
    expect(handle).not.toHaveBeenCalled();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('enters edit mode on Enter from the focused display', async () => {
    render(<InlineEdit value="api" onValueChange={() => {}} />);
    const display = screen.getByRole('button');
    display.focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('exposes an imperative `edit()` handle', async () => {
    const ref = createRef<InlineEditHandle>();
    render(<InlineEdit ref={ref} value="api" onValueChange={() => {}} />);
    ref.current?.edit();
    expect(await screen.findByRole('textbox')).toHaveFocus();
  });

  it('does not activate when disabled', async () => {
    render(<InlineEdit value="locked" onValueChange={() => {}} disabled />);
    const display = screen.getByRole('button');
    expect(display).toHaveAttribute('aria-disabled', 'true');
    expect(display).toHaveAttribute('tabindex', '-1');
    await userEvent.dblClick(display);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('renders headings semantically via `as`', () => {
    render(<InlineEdit as="h2" value="Section title" onValueChange={() => {}} />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('has no a11y violations in display mode', async () => {
    const { container } = render(<InlineEdit value="api-gateway" onValueChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations in edit mode', async () => {
    const { container } = render(<InlineEdit value="api" onValueChange={() => {}} />);
    await userEvent.dblClick(screen.getByRole('button'));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders validation error text with a matching id and stays a11y-clean', async () => {
    const { container } = render(
      <InlineEdit
        id="svc-name"
        value="ok"
        onValueChange={() => {}}
        validate={(v) => (v.length < 3 ? 'too short' : null)}
      />,
    );
    await userEvent.dblClick(screen.getByRole('button'));
    const input = screen.getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'ab{Enter}');
    // The error text must exist in the DOM with the id the input references.
    const message = screen.getByRole('alert');
    expect(message).toHaveTextContent('too short');
    expect(input).toHaveAttribute('aria-errormessage', message.getAttribute('id'));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('carries the display label onto the input as aria-label', async () => {
    render(
      <InlineEdit value="payments" onValueChange={() => {}} aria-label="Rename service payments" />,
    );
    await userEvent.dblClick(screen.getByRole('button'));
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Rename service payments');
  });
});
