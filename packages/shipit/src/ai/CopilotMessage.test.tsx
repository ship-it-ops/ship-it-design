import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { CopilotMessage } from './CopilotMessage';

// `role` is a React prop on CopilotMessage (the chat speaker), not an ARIA role.
/* eslint-disable jsx-a11y/aria-role */

describe('CopilotMessage', () => {
  it('renders user message content', () => {
    render(
      <CopilotMessage role="user" avatar="MT">
        Who owns payment-webhook?
      </CopilotMessage>,
    );
    expect(screen.getByText(/Who owns payment-webhook/)).toBeInTheDocument();
  });

  it('renders assistant message with the ✦ avatar', () => {
    const { container } = render(<CopilotMessage role="assistant">Priya owns it.</CopilotMessage>);
    expect(container.querySelector('[data-role="assistant"]')).toBeInTheDocument();
    expect(screen.getByText(/Priya owns it/)).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<CopilotMessage role="assistant">Hello.</CopilotMessage>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
