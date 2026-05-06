import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Slider } from './Slider';

describe('Slider', () => {
  it('exposes a slider role with the value', () => {
    render(<Slider defaultValue={[42]} aria-label="Volume" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '42');
  });

  it('accepts a controlled scalar value (not just an array)', () => {
    render(<Slider value={37} aria-label="v" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '37');
  });

  it('accepts a controlled array value', () => {
    render(<Slider value={[55]} aria-label="v" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '55');
  });

  it('accepts a scalar defaultValue', () => {
    render(<Slider defaultValue={12} aria-label="v" />);
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

  it('updates the showValue chip as the thumb moves (uncontrolled)', () => {
    render(<Slider defaultValue={[10]} showValue aria-label="v" min={0} max={100} step={1} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    const thumb = screen.getByRole('slider');
    thumb.focus();
    // Radix's keyboard handler updates the value; ArrowRight bumps by `step`.
    // Using fireEvent here (not userEvent) because userEvent.keyboard hangs
    // against Radix Slider in jsdom — Radix listens for keydown directly on
    // the thumb, which fireEvent reaches synchronously.
    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('forwards a scalar to consumer onValueChange when input shape was scalar', () => {
    const onChange = vi.fn();
    render(<Slider value={5} onValueChange={onChange} aria-label="v" min={0} max={10} step={1} />);
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it('forwards an array to consumer onValueChange when input shape was an array', () => {
    const onChange = vi.fn();
    render(
      <Slider
        value={[20, 80]}
        onValueChange={onChange}
        thumbLabels={['Min', 'Max']}
        min={0}
        max={100}
        step={1}
      />,
    );
    fireEvent.keyDown(screen.getAllByRole('slider')[0]!, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith([21, 80]);
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
