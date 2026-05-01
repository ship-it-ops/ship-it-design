import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Select } from './Select';

describe('Select', () => {
  it('renders a combobox role with placeholder', () => {
    render(<Select options={['A', 'B']} placeholder="Choose" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows the preselected value', () => {
    render(<Select options={['A', 'B']} defaultValue="B" />);
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Select aria-label="Env" options={['A', 'B']} placeholder="Choose" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
