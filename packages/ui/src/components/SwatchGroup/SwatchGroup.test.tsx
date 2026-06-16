import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { SwatchGroup, type SwatchItem } from './SwatchGroup';

const SWATCHES: SwatchItem[] = [
  { value: 'red', color: '#ef4444', label: 'Red' },
  { value: 'green', color: '#22c55e', label: 'Green' },
  { value: 'blue', color: '#3b82f6', label: 'Blue' },
];

describe('SwatchGroup', () => {
  it('renders a radiogroup with one radio per swatch', () => {
    render(<SwatchGroup swatches={SWATCHES} aria-label="Accent color" />);
    expect(screen.getByRole('radiogroup', { name: 'Accent color' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(SWATCHES.length);
  });

  it('uses the value as the accessible name when no label is given', () => {
    render(<SwatchGroup swatches={[{ value: 'teal', color: '#14b8a6' }]} aria-label="Color" />);
    expect(screen.getByRole('radio', { name: 'teal' })).toBeInTheDocument();
  });

  it('uses a visible label as the group accessible name', () => {
    render(<SwatchGroup swatches={SWATCHES} label="Brand color" />);
    expect(screen.getByRole('radiogroup', { name: 'Brand color' })).toBeInTheDocument();
  });

  it('calls onValueChange and updates aria-checked on click', async () => {
    const handle = vi.fn();
    render(<SwatchGroup swatches={SWATCHES} onValueChange={handle} aria-label="Color" />);
    const green = screen.getByRole('radio', { name: 'Green' });
    await userEvent.click(green);
    expect(handle).toHaveBeenCalledWith('green');
    expect(green).toHaveAttribute('aria-checked', 'true');
  });

  it('reflects a controlled value', () => {
    const { rerender } = render(<SwatchGroup swatches={SWATCHES} value="red" aria-label="Color" />);
    expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    rerender(<SwatchGroup swatches={SWATCHES} value="blue" aria-label="Color" />);
    expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-checked', 'true');
  });

  it('moves selection with arrow keys (and wraps)', async () => {
    const handle = vi.fn();
    render(
      <SwatchGroup
        swatches={SWATCHES}
        defaultValue="green"
        onValueChange={handle}
        aria-label="Color"
      />,
    );
    screen.getByRole('radio', { name: 'Green' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(handle).toHaveBeenLastCalledWith('blue');
    // Wrap forward: blue -> red
    await userEvent.keyboard('{ArrowRight}');
    expect(handle).toHaveBeenLastCalledWith('red');
    // Wrap backward: red -> blue
    await userEvent.keyboard('{ArrowLeft}');
    expect(handle).toHaveBeenLastCalledWith('blue');
  });

  it('moves DOM focus to the newly selected tile on arrow nav', async () => {
    render(<SwatchGroup swatches={SWATCHES} defaultValue="red" aria-label="Color" />);
    screen.getByRole('radio', { name: 'Red' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Green' }));
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Blue' }));
    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Red' }));
  });

  it('jumps to first/last with Home/End', async () => {
    const handle = vi.fn();
    render(
      <SwatchGroup
        swatches={SWATCHES}
        defaultValue="green"
        onValueChange={handle}
        aria-label="Color"
      />,
    );
    screen.getByRole('radio', { name: 'Green' }).focus();
    await userEvent.keyboard('{End}');
    expect(handle).toHaveBeenLastCalledWith('blue');
    await userEvent.keyboard('{Home}');
    expect(handle).toHaveBeenLastCalledWith('red');
  });

  it('applies roving tabindex — only the selected tile is tabbable', () => {
    render(<SwatchGroup swatches={SWATCHES} defaultValue="green" aria-label="Color" />);
    expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('tabindex', '-1');
  });

  it('makes the first tile tabbable when nothing is selected', () => {
    render(<SwatchGroup swatches={SWATCHES} aria-label="Color" />);
    expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('tabindex', '0');
  });

  it('renders the swatch color as an inline background', () => {
    render(<SwatchGroup swatches={SWATCHES} aria-label="Color" />);
    const red = screen.getByRole('radio', { name: 'Red' });
    expect(red.style.background).toBe('rgb(239, 68, 68)');
  });

  it('shows a ring (data-checked) and check mark only on the selected tile', () => {
    render(<SwatchGroup swatches={SWATCHES} value="blue" aria-label="Color" />);
    const blue = screen.getByRole('radio', { name: 'Blue' });
    const red = screen.getByRole('radio', { name: 'Red' });
    expect(blue).toHaveAttribute('data-checked');
    expect(red).not.toHaveAttribute('data-checked');
    expect(blue.querySelector('[data-swatch-check]')).not.toBeNull();
    expect(red.querySelector('[data-swatch-check]')).toBeNull();
  });

  it('renders a dark check on a light swatch', () => {
    render(
      <SwatchGroup
        swatches={[{ value: 'white', color: '#ffffff', label: 'White' }]}
        value="white"
        aria-label="Color"
      />,
    );
    const check = screen.getByRole('radio', { name: 'White' }).querySelector('[data-swatch-check]');
    expect(check).toHaveAttribute('stroke', '#000000');
  });

  it('renders a light check on a dark swatch', () => {
    render(
      <SwatchGroup
        swatches={[{ value: 'black', color: '#000000', label: 'Black' }]}
        value="black"
        aria-label="Color"
      />,
    );
    const check = screen.getByRole('radio', { name: 'Black' }).querySelector('[data-swatch-check]');
    expect(check).toHaveAttribute('stroke', '#ffffff');
  });

  it('falls back to a safe dark check for an unparseable color', () => {
    render(
      <SwatchGroup
        swatches={[{ value: 'mystery', color: 'var(--brand)', label: 'Mystery' }]}
        value="mystery"
        aria-label="Color"
      />,
    );
    const check = screen
      .getByRole('radio', { name: 'Mystery' })
      .querySelector('[data-swatch-check]');
    expect(check).toHaveAttribute('stroke', '#000000');
  });

  it('parses rgb() colors for contrast (dark -> light check)', () => {
    render(
      <SwatchGroup
        swatches={[{ value: 'navy', color: 'rgb(10, 20, 60)', label: 'Navy' }]}
        value="navy"
        aria-label="Color"
      />,
    );
    const check = screen.getByRole('radio', { name: 'Navy' }).querySelector('[data-swatch-check]');
    expect(check).toHaveAttribute('stroke', '#ffffff');
  });

  it('supports size variants', () => {
    render(<SwatchGroup swatches={SWATCHES} size="lg" aria-label="Color" />);
    expect(screen.getByRole('radio', { name: 'Red' }).className).toContain('h-10');
  });

  // SwatchGroup renders inline (no Radix portal), so scan the rendered
  // container — scanning document.body trips axe's page-level "region"
  // landmark rule, which is not a component concern. (See Rating's tests.)
  it('has no a11y violations', async () => {
    const { container } = render(
      <SwatchGroup swatches={SWATCHES} defaultValue="green" label="Accent color" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
