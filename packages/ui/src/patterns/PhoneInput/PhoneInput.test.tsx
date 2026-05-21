import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { PhoneInput } from './PhoneInput';

describe('PhoneInput', () => {
  it('emits E.164 on national-number input', async () => {
    const handle = vi.fn();
    render(<PhoneInput onValueChange={handle} />);
    await userEvent.type(screen.getByLabelText('Phone number'), '4155550100');
    expect(handle).toHaveBeenLastCalledWith('+14155550100');
  });

  it('strips non-digits from the national number', async () => {
    const handle = vi.fn();
    render(<PhoneInput onValueChange={handle} />);
    await userEvent.type(screen.getByLabelText('Phone number'), '(415) 555-0100');
    expect(handle).toHaveBeenLastCalledWith('+14155550100');
  });

  it('parses an initial E.164 value', () => {
    render(<PhoneInput value="+442079460000" />);
    expect(screen.getByLabelText('Phone number')).toHaveValue('2079460000');
  });
});
