import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Dots } from './Dots';

describe('Dots', () => {
  it('renders the requested number of dots', () => {
    render(<Dots total={5} current={1} onChange={() => {}} />);
    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  it('marks the active dot', () => {
    render(<Dots total={5} current={2} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Go to slide 3' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('emits onChange on click', async () => {
    const onChange = vi.fn();
    render(<Dots total={5} current={1} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Go to slide 4' }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('renders non-interactively without onChange', () => {
    render(<Dots total={5} current={1} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Dots total={5} current={2} onChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
