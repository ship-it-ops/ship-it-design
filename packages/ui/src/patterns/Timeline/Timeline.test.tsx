import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Timeline, TimelineItem } from './Timeline';

const events = [
  {
    title: 'Connector added',
    description: 'github · 4 repos',
    time: 'just now',
    tone: 'accent' as const,
  },
  {
    title: 'Schema extracted',
    description: '142 entity types',
    time: '4m ago',
    tone: 'ok' as const,
  },
];

describe('Timeline', () => {
  it('renders events', () => {
    render(<Timeline events={events} />);
    expect(screen.getByText('Connector added')).toBeInTheDocument();
    expect(screen.getByText('Schema extracted')).toBeInTheDocument();
  });

  it('supports children composition', () => {
    render(
      <Timeline>
        <TimelineItem>One</TimelineItem>
        <TimelineItem>Two</TimelineItem>
      </Timeline>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Timeline events={events} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
