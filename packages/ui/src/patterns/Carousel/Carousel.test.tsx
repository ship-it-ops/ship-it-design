import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Carousel } from './Carousel';

const items = ['A', 'B', 'C'];

describe('Carousel', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  it('marks the active dot with aria-current', async () => {
    render(
      <Carousel
        items={items}
        defaultIndex={1}
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const dots = screen.getAllByRole('button', { name: /Go to slide/ });
    expect(dots[1]).toHaveAttribute('aria-current', 'true');
    expect(dots[0]).not.toHaveAttribute('aria-current');
  });

  it('scrolls the viewport when the controlled index changes from outside', () => {
    const scrollSpy = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {});
    const six = ['A', 'B', 'C', 'D', 'E', 'F'];
    const { rerender, container } = render(
      <Carousel items={six} index={2} renderItem={(v) => <div>{v}</div>} aria-label="Photos" />,
    );
    // jsdom reports clientWidth: 0, which makes the sync effect bail. Force
    // it nonzero so the effect can do real work — and on the slide whose
    // scrollIntoView we want to assert against.
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    Object.defineProperty(viewport, 'clientWidth', { value: 300, configurable: true });

    scrollSpy.mockClear();

    rerender(
      <Carousel items={six} index={5} renderItem={(v) => <div>{v}</div>} aria-label="Photos" />,
    );

    // The sync effect uses behavior: 'instant' — the call we want.
    // (`'instant'` not `'auto'` so the viewport's scroll-smooth CSS
    // doesn't override into an animated sync.)
    const instantCalls = scrollSpy.mock.calls.filter(
      ([opts]) => (opts as ScrollIntoViewOptions | undefined)?.behavior === 'instant',
    );
    expect(instantCalls.length).toBeGreaterThan(0);
    // And it should have run on the slide that's now active (DOM index 5
    // when loop is off — which it is here).
    const instantInvocation =
      scrollSpy.mock.instances[
        scrollSpy.mock.calls.findIndex(
          ([opts]) => (opts as ScrollIntoViewOptions | undefined)?.behavior === 'instant',
        )
      ];
    expect(instantInvocation).toBe(viewport.children[5]);
  });

  it('wraps next from the last slide back to the first when loop is on', async () => {
    const handle = vi.fn();
    render(
      <Carousel
        items={items}
        defaultIndex={2}
        loop
        onIndexChange={handle}
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(handle).toHaveBeenLastCalledWith(0);
  });

  it('wraps prev from the first slide back to the last when loop is on', async () => {
    const handle = vi.fn();
    render(
      <Carousel
        items={items}
        defaultIndex={0}
        loop
        onIndexChange={handle}
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    expect(handle).toHaveBeenLastCalledWith(2);
  });

  it('keeps prev/next arrows enabled at the boundaries when loop is on', () => {
    render(
      <Carousel
        items={items}
        defaultIndex={0}
        loop
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    expect(screen.getByRole('button', { name: 'Previous slide' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next slide' })).not.toBeDisabled();
  });

  it('renders clone twins around the real slides when loop is on', () => {
    const { container } = render(
      <Carousel items={items} loop renderItem={(v) => <div>{v}</div>} aria-label="Photos" />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    // 3 real slides + 2 clones (one of last at the start, one of first at
    // the end) = 5 children. Clones are aria-hidden and out of the focus
    // / a11y tree.
    expect(viewport.children).toHaveLength(5);
    expect(viewport.children[0]).toHaveAttribute('aria-hidden', 'true');
    expect(viewport.children[4]).toHaveAttribute('aria-hidden', 'true');
    expect(viewport.children[1]).not.toHaveAttribute('aria-hidden');
    // The accessible slide count (via role=group + aria-label) still
    // counts only the real items.
    expect(screen.getAllByRole('group', { name: /of 3/ })).toHaveLength(3);
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Carousel items={items} renderItem={(v) => <div>{v}</div>} aria-label="Photos" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations when loop is on', async () => {
    const { container } = render(
      <Carousel items={items} loop renderItem={(v) => <div>{v}</div>} aria-label="Photos" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
