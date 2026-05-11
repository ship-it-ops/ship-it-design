import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { ActivityTimeline, type ActivityEvent } from './ActivityTimeline';

const NOW = new Date('2026-05-10T12:00:00Z');

const EVENTS: ActivityEvent[] = [
  {
    id: 'deploy-1',
    icon: '↑',
    actor: { name: 'maya' },
    title: 'Deployed checkout-api',
    at: new Date('2026-05-10T11:30:00Z'),
    payload: '+ 12 commits',
    tone: 'ok',
  },
  {
    id: 'incident-1',
    actor: { name: 'liam' },
    title: 'Opened incident INC-204',
    at: new Date('2026-05-09T12:00:00Z'),
    tone: 'err',
  },
];

describe('ActivityTimeline', () => {
  it('renders each event title', () => {
    render(<ActivityTimeline events={EVENTS} relativeNow={NOW} />);
    expect(screen.getByText('Deployed checkout-api')).toBeInTheDocument();
    expect(screen.getByText('Opened incident INC-204')).toBeInTheDocument();
  });

  it('formats event times deterministically when relativeNow is supplied', () => {
    render(<ActivityTimeline events={EVENTS} relativeNow={NOW} />);
    expect(screen.getByText('30m ago')).toBeInTheDocument();
    expect(screen.getByText('1d ago')).toBeInTheDocument();
  });

  it('shows the actor name when provided', () => {
    render(<ActivityTimeline events={EVENTS} relativeNow={NOW} />);
    expect(screen.getByText('maya')).toBeInTheDocument();
  });

  it('renders a payload preview when provided', () => {
    render(<ActivityTimeline events={EVENTS} relativeNow={NOW} />);
    expect(screen.getByText('+ 12 commits')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<ActivityTimeline events={EVENTS} relativeNow={NOW} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
