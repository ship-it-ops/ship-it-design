import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { WizardDialog, type WizardStep } from './WizardDialog';

const STEPS: WizardStep[] = [
  { id: 'plan', label: 'Plan', content: <div>Plan content</div> },
  { id: 'review', label: 'Review', content: <div>Review content</div> },
  { id: 'launch', label: 'Launch', content: <div>Launch content</div> },
];

describe('WizardDialog', () => {
  it('renders the first step body', () => {
    render(<WizardDialog open steps={STEPS} title="New flow" />);
    expect(screen.getByText('Plan content')).toBeInTheDocument();
  });

  it('disables Back on the first step', () => {
    render(<WizardDialog open steps={STEPS} />);
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
  });

  it('advances when Next is clicked', async () => {
    render(<WizardDialog open steps={STEPS} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Review content')).toBeInTheDocument();
  });

  it('disables Next when canAdvance returns false', () => {
    const blocked: WizardStep[] = [
      { ...STEPS[0]!, canAdvance: () => false },
      ...STEPS.slice(1),
    ];
    render(<WizardDialog open steps={blocked} />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('shows the completion label and fires onComplete on the last step', async () => {
    const onComplete = vi.fn();
    render(<WizardDialog open steps={STEPS} initialStep={2} onComplete={onComplete} />);
    const primary = screen.getByRole('button', { name: 'Done' });
    await userEvent.click(primary);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('has no a11y violations', async () => {
    const { baseElement } = render(
      <WizardDialog open steps={STEPS} title="Wizard" description="Test wizard." />,
    );
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
