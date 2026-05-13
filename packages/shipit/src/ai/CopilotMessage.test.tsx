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

  describe('density="touch"', () => {
    it('aligns the user bubble to the right (items-end)', () => {
      const { container } = render(
        <CopilotMessage role="user" density="touch">
          Who owns payment-webhook?
        </CopilotMessage>,
      );
      const root = container.querySelector('[data-role="user"]');
      expect(root?.className).toContain('items-end');
    });

    it('aligns the assistant bubble to the left and shows the ✦ ShipIt eyebrow', () => {
      const { container } = render(
        <CopilotMessage role="assistant" density="touch">
          Priya owns it.
        </CopilotMessage>,
      );
      const root = container.querySelector('[data-role="assistant"]');
      expect(root?.className).toContain('items-start');
      expect(screen.getByText('ShipIt')).toBeInTheDocument();
    });

    it('swaps the assistant eyebrow to "thinking" while streaming', () => {
      render(
        <CopilotMessage role="assistant" density="touch" streaming>
          …
        </CopilotMessage>,
      );
      expect(screen.getByText('thinking')).toBeInTheDocument();
      expect(screen.queryByText('ShipIt')).not.toBeInTheDocument();
    });

    it('has no a11y violations for the user touch variant', async () => {
      const { container } = render(
        <CopilotMessage role="user" density="touch">
          Hello.
        </CopilotMessage>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no a11y violations for the assistant touch variant', async () => {
      const { container } = render(
        <CopilotMessage role="assistant" density="touch">
          Hello.
        </CopilotMessage>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
