import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { ToolCallCard } from './ToolCallCard';

describe('ToolCallCard', () => {
  it('renders the tool name and status', () => {
    render(<ToolCallCard name="graph.query" status="94ms · 142 rows" />);
    expect(screen.getByText('graph.query')).toBeInTheDocument();
    expect(screen.getByText('94ms · 142 rows')).toBeInTheDocument();
  });

  it('shows running text when streaming', () => {
    render(<ToolCallCard name="docs.search" running />);
    expect(screen.getByText(/running/)).toBeInTheDocument();
  });

  it('renders body content', () => {
    render(<ToolCallCard name="graph.query">{'match (s) return s'}</ToolCallCard>);
    expect(screen.getByText('match (s) return s')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<ToolCallCard name="graph.query" status="94ms" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
