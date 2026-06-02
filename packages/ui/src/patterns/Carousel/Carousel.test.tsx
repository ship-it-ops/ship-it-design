import { act, render, screen } from '@testing-library/react';
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

  it('routes next-arrow wrap through the clone-end, not the real first', async () => {
    const five = ['A', 'B', 'C', 'D', 'E'];
    const N = five.length;
    const scrollSpy = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {});
    const { container } = render(
      <Carousel
        items={five}
        defaultIndex={N - 1}
        loop
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    scrollSpy.mockClear();
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    const smoothTargets = scrollSpy.mock.calls.flatMap((call, i) => {
      const opts = call[0] as ScrollIntoViewOptions | undefined;
      return opts?.behavior === 'smooth' ? [scrollSpy.mock.instances[i]] : [];
    });
    expect(smoothTargets).toHaveLength(1);
    // Wrap target is children[N + 1] (clone of items[0]) so the smooth
    // scroll moves a single slide forward, not children[1] (real items[0])
    // which would rewind across the whole strip.
    expect(smoothTargets[0]).toBe(viewport.children[N + 1]);
    expect(smoothTargets[0]).not.toBe(viewport.children[1]);
  });

  it('routes prev-arrow wrap through the clone-start, not the real last', async () => {
    const five = ['A', 'B', 'C', 'D', 'E'];
    const N = five.length;
    const scrollSpy = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {});
    const { container } = render(
      <Carousel
        items={five}
        defaultIndex={0}
        loop
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    scrollSpy.mockClear();
    await userEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    const smoothTargets = scrollSpy.mock.calls.flatMap((call, i) => {
      const opts = call[0] as ScrollIntoViewOptions | undefined;
      return opts?.behavior === 'smooth' ? [scrollSpy.mock.instances[i]] : [];
    });
    expect(smoothTargets).toHaveLength(1);
    expect(smoothTargets[0]).toBe(viewport.children[0]);
    expect(smoothTargets[0]).not.toBe(viewport.children[N]);
  });

  it('keeps aria-current on the wrap target during the wrap animation', async () => {
    vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {});
    const five = ['A', 'B', 'C', 'D', 'E'];
    const N = five.length;
    const { container } = render(
      <Carousel
        items={five}
        defaultIndex={N - 1}
        loop
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    Object.defineProperty(viewport, 'clientWidth', { value: 300, configurable: true });
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    // Mid-animation: scrollLeft sits at width * N (the last real slide),
    // which rounds to DOM index N. Without the wrap-in-progress guard the
    // non-edge branch would call setActive(N - 1) here and the dot
    // indicator would flicker back to the previous slide.
    Object.defineProperty(viewport, 'scrollLeft', { value: 300 * N, configurable: true });
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    const dots = screen.getAllByRole('button', { name: /Go to slide/ });
    expect(dots[0]).toHaveAttribute('aria-current', 'true');
    expect(dots[N - 1]).not.toHaveAttribute('aria-current');
  });

  it('sweep variant: next-arrow wrap targets the real first, not the clone', async () => {
    const five = ['A', 'B', 'C', 'D', 'E'];
    const N = five.length;
    const scrollSpy = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {});
    const { container } = render(
      <Carousel
        items={five}
        defaultIndex={N - 1}
        loop="sweep"
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    scrollSpy.mockClear();
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    const smoothTargets = scrollSpy.mock.calls.flatMap((call, i) => {
      const opts = call[0] as ScrollIntoViewOptions | undefined;
      return opts?.behavior === 'smooth' ? [scrollSpy.mock.instances[i]] : [];
    });
    expect(smoothTargets).toHaveLength(1);
    // Sweep mode keeps the pre-fix behavior: smooth-scroll all the way
    // back to children[1] (the real first), traversing every intermediate
    // slide. NOT children[N + 1] (the clone).
    expect(smoothTargets[0]).toBe(viewport.children[1]);
    expect(smoothTargets[0]).not.toBe(viewport.children[N + 1]);
  });

  it('targets the real twin directly for mid-strip dot jumps when loop is on', async () => {
    const five = ['A', 'B', 'C', 'D', 'E'];
    const scrollSpy = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {});
    const { container } = render(
      <Carousel
        items={five}
        defaultIndex={0}
        loop
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    scrollSpy.mockClear();
    // Jump from slide 0 to slide 2 via its dot — not a wrap step, so the
    // smooth scroll should still land on the real twin (children[3] when
    // looping, since DOM 0 is the leading clone).
    await userEvent.click(screen.getByRole('button', { name: 'Go to slide 3' }));
    const smoothTargets = scrollSpy.mock.calls.flatMap((call, i) => {
      const opts = call[0] as ScrollIntoViewOptions | undefined;
      return opts?.behavior === 'smooth' ? [scrollSpy.mock.instances[i]] : [];
    });
    expect(smoothTargets).toHaveLength(1);
    expect(smoothTargets[0]).toBe(viewport.children[3]);
  });

  it('defers the clone-end snap until the wrap scroll has fully landed', async () => {
    const scrollSpy = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {});
    const five = ['A', 'B', 'C', 'D', 'E'];
    const N = five.length;
    const width = 300;
    const { container } = render(
      <Carousel
        items={five}
        defaultIndex={N - 1}
        loop
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    Object.defineProperty(viewport, 'clientWidth', { value: width, configurable: true });
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));

    // Midway through the wrap animation: scrollLeft rounds to N + 1, but
    // the smooth scroll hasn't actually landed yet. Snapping here would
    // cancel the animation and produce the half-slide-then-teleport
    // flicker the user reported.
    scrollSpy.mockClear();
    Object.defineProperty(viewport, 'scrollLeft', {
      value: (N + 0.6) * width,
      configurable: true,
    });
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    const midInstantTargets = scrollSpy.mock.calls.flatMap((call, i) => {
      const opts = call[0] as ScrollIntoViewOptions | undefined;
      return opts?.behavior === 'instant' ? [scrollSpy.mock.instances[i]] : [];
    });
    expect(midInstantTargets).toHaveLength(0);

    // Animation lands on the clone position. Now the snap should fire.
    Object.defineProperty(viewport, 'scrollLeft', {
      value: (N + 1) * width,
      configurable: true,
    });
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    const landedInstantTargets = scrollSpy.mock.calls.flatMap((call, i) => {
      const opts = call[0] as ScrollIntoViewOptions | undefined;
      return opts?.behavior === 'instant' ? [scrollSpy.mock.instances[i]] : [];
    });
    expect(landedInstantTargets[0]).toBe(viewport.children[1]);
  });

  it('still snaps from clone-end to the real first on native-swipe wrap', () => {
    const five = ['A', 'B', 'C', 'D', 'E'];
    const N = five.length;
    const scrollSpy = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {});
    const { container } = render(
      <Carousel
        items={five}
        defaultIndex={N - 1}
        loop
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    Object.defineProperty(viewport, 'clientWidth', { value: 300, configurable: true });
    Object.defineProperty(viewport, 'scrollLeft', { value: 300 * (N + 1), configurable: true });
    scrollSpy.mockClear();
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    const instantTargets = scrollSpy.mock.calls.flatMap((call, i) => {
      const opts = call[0] as ScrollIntoViewOptions | undefined;
      return opts?.behavior === 'instant' ? [scrollSpy.mock.instances[i]] : [];
    });
    expect(instantTargets.length).toBeGreaterThan(0);
    // The snap from clone-end (children[N + 1]) lands on the real first
    // (children[1]). This is the native-swipe path — must not regress.
    expect(instantTargets[0]).toBe(viewport.children[1]);
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
