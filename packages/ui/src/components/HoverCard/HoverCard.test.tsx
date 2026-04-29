import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { HoverCard } from './HoverCard';

describe('HoverCard', () => {
  it('renders the trigger', () => {
    render(<HoverCard trigger={<span>@priya</span>} content="content" />);
    expect(screen.getByText('@priya')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<HoverCard trigger={<a href="#">x</a>} content="hi" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
