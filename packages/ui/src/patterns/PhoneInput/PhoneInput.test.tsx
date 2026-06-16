import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Field } from '../../components/Field';

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

  /*
   * Regression: country/national were initialized once at mount, so a
   * controlled-mode prop change (form reset, route restore) used to leave
   * the visible inputs stale while `committed` updated correctly.
   */
  it('re-syncs the visible inputs when the controlled value changes', () => {
    const { rerender } = render(<PhoneInput value="+14155550100" />);
    expect(screen.getByLabelText('Phone number')).toHaveValue('4155550100');

    rerender(<PhoneInput value="+442079460000" />);
    expect(screen.getByLabelText('Phone number')).toHaveValue('2079460000');

    rerender(<PhoneInput value="" />);
    expect(screen.getByLabelText('Phone number')).toHaveValue('');
  });

  it('forwards id to the inner tel input so a label can target it', () => {
    render(
      <>
        <label htmlFor="phone">Phone</label>
        <PhoneInput id="phone" />
      </>,
    );
    const input = screen.getByLabelText('Phone number');
    expect(input).toHaveAttribute('id', 'phone');
    // The external <label htmlFor="phone"> now resolves to this input.
    expect(screen.getByLabelText('Phone')).toBe(input);
  });

  it("threads a Field render-prop's generated id and aria wiring to the input", () => {
    render(
      <Field label="Mobile" error="Required">
        {(p) => <PhoneInput {...p} />}
      </Field>,
    );
    const input = screen.getByLabelText('Mobile');
    expect(input).toHaveAttribute('id');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<PhoneInput />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
