import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Slider } from './Slider';

describe('Slider', () => {
  it('exposes a slider role with the value', () => {
    render(<Slider defaultValue={[42]} aria-label="Volume" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '42');
  });

  it('accepts a controlled scalar value (not just an array)', () => {
    render(<Slider value={37 as unknown as never} aria-label="v" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '37');
  });

  it('accepts a controlled array value', () => {
    render(<Slider value={[55]} aria-label="v" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '55');
  });

  it('accepts a scalar defaultValue', () => {
    render(<Slider defaultValue={12 as unknown as never} aria-label="v" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '12');
  });

  it('falls back to min when no value or defaultValue is set', () => {
    render(<Slider showValue min={5} aria-label="v" />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders the value chip when showValue is true', () => {
    render(<Slider defaultValue={[42]} showValue aria-label="v" />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('forwards aria-label to the thumb (no longer hardcoded to "Value")', () => {
    render(<Slider defaultValue={[42]} aria-label="Volume" />);
    expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument();
  });

  it('falls back to "Value" when no aria-label or aria-labelledby is supplied', () => {
    render(<Slider defaultValue={[42]} />);
    expect(screen.getByRole('slider', { name: 'Value' })).toBeInTheDocument();
  });

  it('renders one thumb per value with per-thumb labels for ranges', () => {
    render(<Slider defaultValue={[20, 80]} thumbLabels={['Min', 'Max']} />);
    const thumbs = screen.getAllByRole('slider');
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveAccessibleName('Min');
    expect(thumbs[1]).toHaveAccessibleName('Max');
  });

  it('forwards aria-labelledby to the thumb when no per-thumb label is given', () => {
    render(
      <>
        <span id="vol-label">Volume</span>
        <Slider defaultValue={[42]} aria-labelledby="vol-label" />
      </>,
    );
    expect(screen.getByRole('slider')).toHaveAttribute('aria-labelledby', 'vol-label');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Slider defaultValue={[42]} aria-label="Volume" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
