import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Citation } from './Citation';

describe('Citation', () => {
  it('renders the source row in the default block variant', () => {
    render(<Citation index={2} source="runbook-oncall.md:L42" meta="github · 3h ago" />);
    expect(screen.getByText(/runbook-oncall/)).toBeInTheDocument();
    expect(screen.getByText(/github · 3h ago/)).toBeInTheDocument();
  });

  it('inline mode renders only the superscript number', () => {
    render(<Citation inline index={3} source="docs.md" />);
    const sup = screen.getByLabelText('Citation 3: docs.md');
    expect(sup.tagName).toBe('SUP');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Citation index={1} source="team-roster.md" meta="notion · 2d ago" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
