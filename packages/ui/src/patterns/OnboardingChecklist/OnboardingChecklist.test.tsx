import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import {
  OnboardingChecklist,
  type OnboardingItem,
} from './OnboardingChecklist';

const ITEMS: OnboardingItem[] = [
  { id: 'connect', label: 'Connect your repo', status: 'done' },
  { id: 'invite', label: 'Invite your team', status: 'in-progress' },
  { id: 'monitor', label: 'Set up monitors', status: 'pending' },
];

describe('OnboardingChecklist', () => {
  it('renders the default progress label', () => {
    render(<OnboardingChecklist items={ITEMS} />);
    expect(screen.getByText('1 of 3 complete')).toBeInTheDocument();
  });

  it('renders each item label', () => {
    render(<OnboardingChecklist items={ITEMS} />);
    expect(screen.getByText('Connect your repo')).toBeInTheDocument();
    expect(screen.getByText('Invite your team')).toBeInTheDocument();
    expect(screen.getByText('Set up monitors')).toBeInTheDocument();
  });

  it('makes items clickable when onItemClick is provided', async () => {
    const onItemClick = vi.fn();
    render(<OnboardingChecklist items={ITEMS} onItemClick={onItemClick} />);
    await userEvent.click(screen.getByText('Set up monitors'));
    expect(onItemClick).toHaveBeenCalledWith('monitor');
  });

  it('shows aria-current on the in-progress item when interactive', () => {
    render(<OnboardingChecklist items={ITEMS} onItemClick={() => {}} />);
    const inProgress = screen.getByRole('button', { name: /Invite your team/ });
    expect(inProgress.getAttribute('aria-current')).toBe('step');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<OnboardingChecklist items={ITEMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
