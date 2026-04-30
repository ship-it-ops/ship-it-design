import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Field } from './Field';

describe('Field', () => {
  it('associates label with the control', () => {
    render(<Field label="Email">{(p) => <input placeholder="email" {...p} />}</Field>);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
  });

  it('wires aria-describedby to the hint when no error', () => {
    render(
      <Field label="Domain" hint="Lowercase only">
        {(p) => <input {...p} />}
      </Field>,
    );
    const input = screen.getByLabelText('Domain');
    const hintId = input.getAttribute('aria-describedby');
    expect(hintId).toBeTruthy();
    expect(document.getElementById(hintId!)?.textContent).toBe('Lowercase only');
  });

  it('replaces hint with error and marks aria-invalid', () => {
    render(
      <Field label="Email" hint="We never share it" error="Invalid email">
        {(p) => <input {...p} />}
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const id = input.getAttribute('aria-describedby');
    expect(document.getElementById(id!)?.textContent).toBe('Invalid email');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Field label="Workspace" hint="Lowercase only">
        {(p) => <input {...p} />}
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
