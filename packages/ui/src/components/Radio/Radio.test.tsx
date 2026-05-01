import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Radio, RadioGroup } from './Radio';

describe('Radio', () => {
  it('selects an option', async () => {
    const handle = vi.fn();
    render(
      <RadioGroup onValueChange={handle}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    await userEvent.click(screen.getByLabelText('B'));
    expect(handle).toHaveBeenCalledWith('b');
  });

  it('does not select when disabled', async () => {
    const handle = vi.fn();
    render(
      <RadioGroup onValueChange={handle}>
        <Radio value="a" label="A" disabled />
      </RadioGroup>,
    );
    await userEvent.click(screen.getByLabelText('A'));
    expect(handle).not.toHaveBeenCalled();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <RadioGroup defaultValue="a">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
