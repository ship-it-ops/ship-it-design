import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { SuggestionChip } from './SuggestionChip';

describe('SuggestionChip', () => {
  it('renders its label', () => {
    render(<SuggestionChip>Who is on-call?</SuggestionChip>);
    expect(screen.getByRole('button', { name: /Who is on-call/ })).toBeInTheDocument();
  });

  it('fires onClick', async () => {
    const onClick = vi.fn();
    render(<SuggestionChip onClick={onClick}>Recent rollbacks</SuggestionChip>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<SuggestionChip>Anything</SuggestionChip>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
