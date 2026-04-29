import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('accepts typing', async () => {
    render(<Textarea placeholder="describe" />);
    const t = screen.getByPlaceholderText('describe');
    await userEvent.type(t, 'hello');
    expect(t).toHaveValue('hello');
  });

  it('marks aria-invalid when error', () => {
    render(<Textarea placeholder="x" error />);
    expect(screen.getByPlaceholderText('x')).toHaveAttribute('aria-invalid', 'true');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <label>
        Description
        <Textarea placeholder="…" />
      </label>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
