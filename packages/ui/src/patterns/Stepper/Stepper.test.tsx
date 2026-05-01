import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Stepper } from './Stepper';

const steps = ['Workspace', 'Connect', 'Review', 'Invite'] as const;

describe('Stepper', () => {
  it('marks the current step with aria-current', () => {
    render(<Stepper steps={steps} current={2} />);
    const current = screen.getByText('Review').closest('[role="listitem"]');
    expect(current).toHaveAttribute('aria-current', 'step');
  });

  it('renders ✓ for done steps and the index for upcoming steps', () => {
    const { container } = render(<Stepper steps={steps} current={2} />);
    const dots = container.querySelectorAll('[role="listitem"] > span:first-child');
    expect(dots[0]).toHaveTextContent('✓');
    expect(dots[1]).toHaveTextContent('✓');
    expect(dots[2]).toHaveTextContent('3');
    expect(dots[3]).toHaveTextContent('4');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Stepper steps={steps} current={1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
