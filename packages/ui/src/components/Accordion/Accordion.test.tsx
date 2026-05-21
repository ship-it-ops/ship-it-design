import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

function Setup({ type = 'single' as 'single' | 'multiple' }) {
  return (
    <Accordion type={type as 'single'} collapsible>
      <AccordionItem value="one">
        <AccordionTrigger>What is included?</AccordionTrigger>
        <AccordionContent>Unlimited mileage and basic protection.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Cancellation policy</AccordionTrigger>
        <AccordionContent>Free cancellation up to 24 hours before pickup.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('expands a section on trigger click', async () => {
    render(<Setup />);
    const first = screen.getByRole('button', { name: 'What is included?' });
    expect(first).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');
  });

  it('only one section open in single mode', async () => {
    render(<Setup />);
    const first = screen.getByRole('button', { name: 'What is included?' });
    const second = screen.getByRole('button', { name: 'Cancellation policy' });
    await userEvent.click(first);
    await userEvent.click(second);
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(second).toHaveAttribute('aria-expanded', 'true');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Setup />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
