import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { ReasoningBlock, ReasoningStep } from './ReasoningBlock';

describe('ReasoningBlock', () => {
  it('starts collapsed by default and expands on click', async () => {
    render(
      <ReasoningBlock duration="1.8s">
        <ReasoningStep step={1}>Found service</ReasoningStep>
        <ReasoningStep step={2}>Traversed edge</ReasoningStep>
      </ReasoningBlock>,
    );
    expect(screen.queryByText('Found service')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Found service')).toBeInTheDocument();
  });

  it('infers step count from children', () => {
    render(
      <ReasoningBlock>
        <ReasoningStep step={1}>One</ReasoningStep>
        <ReasoningStep step={2}>Two</ReasoningStep>
        <ReasoningStep step={3}>Three</ReasoningStep>
      </ReasoningBlock>,
    );
    expect(screen.getByRole('button')).toHaveTextContent('Reasoning · 3 steps');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <ReasoningBlock defaultOpen duration="1.8s">
        <ReasoningStep step={1}>One</ReasoningStep>
      </ReasoningBlock>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
