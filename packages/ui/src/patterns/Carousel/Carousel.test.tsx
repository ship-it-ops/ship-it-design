import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Carousel } from './Carousel';

const items = ['A', 'B', 'C'];

describe('Carousel', () => {
  it('renders one slide per item', () => {
    render(<Carousel items={items} renderItem={(v) => <div>{v}</div>} aria-label="Photos" />);
    expect(screen.getAllByRole('group', { name: /of 3/ })).toHaveLength(3);
  });

  it('advances on Next click', async () => {
    const handle = vi.fn();
    render(
      <Carousel
        items={items}
        defaultIndex={0}
        onIndexChange={handle}
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(handle).toHaveBeenCalledWith(1);
  });

  it('exposes dot tabs with aria-selected', async () => {
    render(
      <Carousel
        items={items}
        defaultIndex={1}
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Carousel items={items} renderItem={(v) => <div>{v}</div>} aria-label="Photos" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
