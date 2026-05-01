import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
} from './AlertDialog';

function Stateful({ initial = true }: { initial?: boolean }) {
  const [open, setOpen] = useState(initial);
  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
      title="Disconnect?"
      description="This action cannot be undone."
      footer={
        <>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Disconnect</AlertDialogAction>
        </>
      }
    />
  );
}

describe('AlertDialog', () => {
  it('renders title and description when open', () => {
    render(
      <AlertDialog open title="Disconnect?" description="Cannot be undone.">
        <p>extra body</p>
      </AlertDialog>,
    );
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveAccessibleName('Disconnect?');
    expect(screen.getByText('Cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('extra body')).toBeInTheDocument();
  });

  it('renders without a description when none is given', () => {
    render(<AlertDialog open title="Heads up" />);
    expect(screen.getByRole('alertdialog')).toHaveAccessibleName('Heads up');
  });

  it('hides when closed', () => {
    render(<AlertDialog open={false} title="x" />);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('cancel and action buttons trigger their handlers', async () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(
      <AlertDialog
        open
        title="Disconnect?"
        footer={
          <>
            <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Disconnect</AlertDialogAction>
          </>
        }
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('closes via ESC', async () => {
    render(<Stateful />);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <AlertDialog open title="Disconnect?" description="Cannot be undone." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
