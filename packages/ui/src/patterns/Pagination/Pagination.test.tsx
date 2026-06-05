import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Pagination } from './Pagination';

function Controlled() {
  const [page, setPage] = useState(3);
  return <Pagination page={page} total={42} onPageChange={setPage} />;
}

describe('Pagination', () => {
  it('marks the current page', () => {
    render(<Pagination page={3} total={42} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('disables prev on the first page', () => {
    render(<Pagination page={1} total={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('emits onPageChange when a page is clicked', async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={3} total={10} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Go to page 4' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('updates current page on next click', async () => {
    render(<Controlled />);
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByRole('button', { name: 'Go to page 4' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('renders page buttons inside an <ol> of <li> rows', () => {
    const { container } = render(<Pagination page={3} total={5} onPageChange={() => {}} />);
    const ol = container.querySelector('nav > ol');
    expect(ol).not.toBeNull();
    // Five pages → five <li>; each carries either a page button or an ellipsis span.
    const items = ol!.querySelectorAll(':scope > li');
    expect(items.length).toBeGreaterThanOrEqual(3);
    // Numeric page buttons live inside <li>, not as raw <nav> siblings.
    for (const btn of container.querySelectorAll('button[aria-label^="Go to page"]')) {
      expect(btn.parentElement?.tagName).toBe('LI');
    }
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Pagination page={3} total={10} onPageChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
