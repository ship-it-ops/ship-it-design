import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { FileChip } from './FileChip';

describe('FileChip', () => {
  it('renders the file name and extension thumb', () => {
    render(<FileChip name="runbook.pdf" size="2.4 MB" />);
    expect(screen.getByText('runbook.pdf')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('shows progress percent when uploading', () => {
    render(<FileChip name="diagram.md" size="18 KB" progress={62} />);
    expect(screen.getByText(/62%/)).toBeInTheDocument();
  });

  it('hides progress bar at 100%', () => {
    const { container } = render(<FileChip name="a.pdf" size="2.4 MB" progress={100} />);
    expect(container.querySelector('[style*="width"]')).toBeFalsy();
  });

  it('emits onRemove when × is clicked', async () => {
    const onRemove = vi.fn();
    render(<FileChip name="a.pdf" onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove a.pdf' }));
    expect(onRemove).toHaveBeenCalled();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<FileChip name="runbook.pdf" size="2.4 MB" onRemove={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
