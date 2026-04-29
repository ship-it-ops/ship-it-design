import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Slider } from './Slider';

describe('Slider', () => {
  it('exposes a slider role with the value', () => {
    render(<Slider defaultValue={[42]} aria-label="Volume" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '42');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Slider defaultValue={[42]} aria-label="Volume" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
