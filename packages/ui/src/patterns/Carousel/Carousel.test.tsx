import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Carousel } from './Carousel';

const items = ['A', 'B', 'C'];

// All slides are full viewport width, so DOM slide index `d` sits at
// scroll-left `d * WIDTH`. The component reads `clientWidth` (0 in jsdom)
// to compute scroll targets, so tests force a known width and then assert
// on the `left` passed to `viewport.scrollTo({ left, behavior })`.
const WIDTH = 300;

const setWidth = (vp: HTMLElement) =>
  Object.defineProperty(vp, 'clientWidth', { value: WIDTH, configurable: true });
const setScrollLeft = (vp: HTMLElement, value: number) =>
  Object.defineProperty(vp, 'scrollLeft', { value, configurable: true });

// The `left` values of every scrollTo call with a given behavior, in call
// order. The viewport is the only element the carousel calls scrollTo on,
// so the instances are always the viewport.
const leftsBy = (spy: { mock: { calls: unknown[][] } }, behavior: ScrollBehavior): number[] =>
  spy.mock.calls
    .filter((call) => (call[0] as ScrollToOptions | undefined)?.behavior === behavior)
    .map((call) => (call[0] as ScrollToOptions).left as number);

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

  it('repositions the mount viewport via horizontal scrollTo, never scrollIntoView (cold-load window-scroll fix)', () => {
    const intoView = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {});
    const scrollTo = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
    const { container } = render(
      <Carousel items={items} loop renderItem={(v) => <div>{v}</div>} aria-label="Photos" />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    // The mount layout effect seeds the real first slide past the leading
    // clone. It MUST use scrollTo on the viewport — which only moves the
    // element's own horizontal scroll box — and never scrollIntoView,
    // whose `block: 'nearest'` scrolls the document vertically and drags
    // the window down to an off-screen (below-the-fold) carousel on cold
    // load. That window pull is the bug this test guards against.
    expect(intoView).not.toHaveBeenCalled();
    const instantIdx = scrollTo.mock.calls.findIndex(
      ([opts]) => (opts as ScrollToOptions | undefined)?.behavior === 'instant',
    );
    expect(instantIdx).toBeGreaterThanOrEqual(0);
    expect(scrollTo.mock.instances[instantIdx]).toBe(viewport);
  });

  it('scrolls the viewport when the controlled index changes from outside', () => {
    const scrollTo = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
    const six = ['A', 'B', 'C', 'D', 'E', 'F'];
    const { rerender, container } = render(
      <Carousel items={six} index={2} renderItem={(v) => <div>{v}</div>} aria-label="Photos" />,
    );
    // jsdom reports clientWidth: 0, which makes the sync effect bail. Force
    // it nonzero so the effect can do real work — and so the scroll target
    // left is determinate.
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    setWidth(viewport);

    scrollTo.mockClear();

    rerender(
      <Carousel items={six} index={5} renderItem={(v) => <div>{v}</div>} aria-label="Photos" />,
    );

    // The sync effect uses behavior: 'instant' — the call we want.
    // (`'instant'` not `'auto'` so the viewport's scroll-smooth CSS
    // doesn't override into an animated sync.) And it should target the
    // slide that's now active: DOM index 5 (loop off → identity), i.e.
    // scroll-left 5 * WIDTH.
    const instantIdx = scrollTo.mock.calls.findIndex(
      ([opts]) => (opts as ScrollToOptions | undefined)?.behavior === 'instant',
    );
    expect(instantIdx).toBeGreaterThanOrEqual(0);
    expect((scrollTo.mock.calls[instantIdx]![0] as ScrollToOptions).left).toBe(5 * WIDTH);
    expect(scrollTo.mock.instances[instantIdx]).toBe(viewport);
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
    const scrollTo = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
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
    setWidth(viewport);
    scrollTo.mockClear();
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    const smooth = leftsBy(scrollTo, 'smooth');
    expect(smooth).toHaveLength(1);
    // Wrap target is DOM index N + 1 (clone of items[0]) so the smooth
    // scroll moves a single slide forward, not DOM index 1 (real items[0])
    // which would rewind across the whole strip.
    expect(smooth[0]).toBe((N + 1) * WIDTH);
    expect(smooth[0]).not.toBe(1 * WIDTH);
  });

  it('routes prev-arrow wrap through the clone-start, not the real last', async () => {
    const five = ['A', 'B', 'C', 'D', 'E'];
    const N = five.length;
    const scrollTo = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
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
    setWidth(viewport);
    scrollTo.mockClear();
    await userEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    const smooth = leftsBy(scrollTo, 'smooth');
    expect(smooth).toHaveLength(1);
    // Wrap target is DOM index 0 (clone-start), not DOM index N (real last).
    expect(smooth[0]).toBe(0);
    expect(smooth[0]).not.toBe(N * WIDTH);
  });

  it('keeps aria-current on the wrap target during the wrap animation', async () => {
    vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
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
    setWidth(viewport);
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    // Mid-animation: scrollLeft sits at width * N (the last real slide),
    // which rounds to DOM index N. Without the goTo-in-progress guard the
    // non-edge branch would call setActive(N - 1) here and the dot
    // indicator (and any consumer-rendered X/Y counter) would flicker
    // back to the previous slide.
    setScrollLeft(viewport, WIDTH * N);
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    const dots = screen.getAllByRole('button', { name: /Go to slide/ });
    expect(dots[0]).toHaveAttribute('aria-current', 'true');
    expect(dots[N - 1]).not.toHaveAttribute('aria-current');
  });

  it('does not flicker active during a non-wrap mid-strip arrow click', async () => {
    vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
    const five = ['A', 'B', 'C', 'D', 'E'];
    const onChange = vi.fn();
    const { container } = render(
      <Carousel
        items={five}
        defaultIndex={0}
        loop
        onIndexChange={onChange}
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    setWidth(viewport);

    // Click Next: activeIdx 0 → 1 (optimistic). goTo guard armed.
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    onChange.mockClear();

    // Halfway through the smooth scroll, scrollLeft = 1.3 * width rounds
    // to DOM 1 → realIdx 0. Without the guard, onScroll would call
    // setActive(0) here — visible as a counter flick "2/5 → 1/5 → 2/5".
    setScrollLeft(viewport, 1.3 * WIDTH);
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    expect(onChange).not.toHaveBeenCalled();

    // Smooth scroll lands at 2 * width (DOM 2 → realIdx 1). realIdx now
    // matches activeIdx, so the guard releases — no setActive call, but
    // a subsequent native interaction can update active.
    setScrollLeft(viewport, 2 * WIDTH);
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    expect(onChange).not.toHaveBeenCalled();

    // Guard released: a follow-up native swipe to slide 2 (DOM 3, realIdx
    // 2) DOES update active.
    setScrollLeft(viewport, 3 * WIDTH);
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it('rebases through the clone bracket on consecutive next-wrap clicks', async () => {
    const scrollTo = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
    const five = ['A', 'B', 'C', 'D', 'E'];
    const N = five.length;
    const { container } = render(
      <Carousel
        items={five}
        defaultIndex={N - 1}
        loop="circular"
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    setWidth(viewport);

    // First click: wraps. wrapInFlightRef captures N + 1 (clone-end).
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    scrollTo.mockClear();

    // Second click: the rebase fires (wrapInFlightRef !== null) and
    // jumps the viewport to DOM index 0 (clone-of-last, visually
    // identical to where the wrap is heading from) via an instant
    // scroll. The subsequent smooth scroll to DOM index 2 then runs
    // forward from there, instead of sweeping backward across the
    // entire strip from clone-end territory.
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));

    const instant = leftsBy(scrollTo, 'instant');
    const smooth = leftsBy(scrollTo, 'smooth');
    expect(instant).toContain(0); // rebase to clone-of-last (DOM 0)
    expect(smooth).toHaveLength(1);
    expect(smooth[0]).toBe(2 * WIDTH); // smooth to DOM index 2 (slide B)

    // And the smooth scroll runs AFTER the instant rebase — otherwise
    // it would start from the clone-end position the first wrap was
    // heading toward.
    const instantIdx = scrollTo.mock.calls.findIndex(
      ([opts]) =>
        (opts as ScrollToOptions | undefined)?.behavior === 'instant' &&
        (opts as ScrollToOptions).left === 0,
    );
    const smoothIdx = scrollTo.mock.calls.findIndex(
      ([opts]) =>
        (opts as ScrollToOptions | undefined)?.behavior === 'smooth' &&
        (opts as ScrollToOptions).left === 2 * WIDTH,
    );
    expect(instantIdx).toBeLessThan(smoothIdx);
  });

  it('rebases through the clone bracket on consecutive prev-wrap clicks', async () => {
    const scrollTo = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
    const five = ['A', 'B', 'C', 'D', 'E'];
    const N = five.length;
    const { container } = render(
      <Carousel
        items={five}
        defaultIndex={0}
        loop="circular"
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    setWidth(viewport);

    // First click: prev-wrap. wrapInFlightRef captures 0 (clone-start).
    await userEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    scrollTo.mockClear();

    // Second click: rebase to DOM index N + 1 (clone-of-first, visually
    // identical to real-first where the prev-wrap was heading from),
    // then smooth scroll to DOM index N - 1 (the new optimistic
    // target = slide N - 2), traversing a single slide width instead of
    // the whole strip.
    await userEvent.click(screen.getByRole('button', { name: 'Previous slide' }));

    const instant = leftsBy(scrollTo, 'instant');
    expect(instant).toContain((N + 1) * WIDTH);

    const smooth = leftsBy(scrollTo, 'smooth');
    expect(smooth).toHaveLength(1);
    expect(smooth[0]).toBe((N - 1) * WIDTH);
  });

  it('releases the goTo guard on viewport pointerdown so user interrupts track scroll', async () => {
    vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
    const five = ['A', 'B', 'C', 'D', 'E'];
    const onChange = vi.fn();
    const { container } = render(
      <Carousel
        items={five}
        defaultIndex={0}
        loop
        onIndexChange={onChange}
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    setWidth(viewport);

    // Start a goTo: click Next, smooth scroll armed for slide 1.
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    onChange.mockClear();

    // User taps the viewport mid-animation (e.g. starts to swipe). The
    // guard releases immediately so the next scroll event tracks where
    // they actually land.
    act(() => {
      viewport.dispatchEvent(new Event('pointerdown'));
    });

    // User drags scroll to slide 3 (DOM 4, realIdx 3). Without the
    // pointerdown release, the guard would hold activeIdx at 1 because
    // realIdx never reaches 1 again.
    setScrollLeft(viewport, 4 * WIDTH);
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    expect(onChange).toHaveBeenLastCalledWith(3);
  });

  it('clears wrapInFlight on pointerdown so a swipe-interrupted wrap does not rebase the next click', async () => {
    const scrollTo = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
    const five = ['A', 'B', 'C', 'D', 'E'];
    const N = five.length;
    const { container } = render(
      <Carousel
        items={five}
        defaultIndex={N - 1}
        loop="circular"
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    setWidth(viewport);

    // Start a next-wrap: arms wrapInFlightRef at N + 1 (clone-end).
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));

    // User swipes mid-animation. Pointerdown must abandon the wrap.
    act(() => {
      viewport.dispatchEvent(new Event('pointerdown'));
    });

    // Snap settles on a mid-strip real slide (DOM 2) — neither edge
    // branch fires, so without the pointerdown clear, wrapInFlightRef
    // would remain stuck at N + 1.
    setScrollLeft(viewport, 2 * WIDTH);
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });

    scrollTo.mockClear();

    // Next arrow click. With the bug, the rebase block would instant-
    // jump to DOM index 0 (or N + 1) before its smooth scroll, producing
    // a flash. With the fix, only the smooth scroll to the new target fires.
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));

    const instant = leftsBy(scrollTo, 'instant');
    expect(instant).not.toContain(0);
    expect(instant).not.toContain((N + 1) * WIDTH);
  });

  it('rebase suppresses the wrap-end snap for the synthetic clone-position scroll event', async () => {
    // Regression: spamming Next 10+ times rapidly through ListingDetail's
    // controlled gallery used to leave the carousel stuck oscillating
    // between slides 5 and 1. Root cause was that the rebase consolidation
    // (instant scroll to the opposite clone before the new smooth scroll)
    // fires a synthetic scroll event whose scrollLeft sits at the clone
    // edge — and the edge branch read it as the tail of a wrap-toward
    // animation, snapping activeIdx to the wrong twin. The rebase-consume
    // guard skips the edge branch while scrollLeft is parked at the
    // rebase domIdx and clears once it progresses past.
    const onChange = vi.fn();
    vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
    const five = ['A', 'B', 'C', 'D', 'E'];
    const N = five.length;
    const { container } = render(
      <Carousel
        items={five}
        defaultIndex={N - 1}
        loop="circular"
        onIndexChange={onChange}
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    setWidth(viewport);

    // Click 1: next-wrap from slide N. Arms wrapInFlightRef = N + 1 and
    // calls setActive(0) — onChange sees 0.
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(onChange).toHaveBeenLastCalledWith(0);
    onChange.mockClear();

    // Click 2: rebase consolidation. Instant-scrolls to DOM index 0
    // (clone-of-last), then smooth-scrolls to DOM index 2 (slide B).
    // setActive(1) — onChange sees 1.
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(onChange).toHaveBeenLastCalledWith(1);
    onChange.mockClear();

    // The rebase's instant scroll landed scrollLeft = 0. Simulate the
    // resulting scroll event. Without the rebase-consume guard, the
    // edge branch would treat scrollLeft = 0 as a natural wrap-end
    // landing and call setActive(N - 1) — desyncing activeIdx from the
    // smooth scroll's actual target (slide B = index 1).
    setScrollLeft(viewport, 0);
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    expect(onChange).not.toHaveBeenCalled();

    // The smooth scroll's early frames still round to domIdx = 0 (any
    // scrollLeft < width / 2). The guard stays armed through those too.
    setScrollLeft(viewport, 50);
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    expect(onChange).not.toHaveBeenCalled();

    // Once scrollLeft progresses past width / 2 — domIdx becomes 1 — the
    // guard clears and the mid-strip branch resumes. goToInProgressRef
    // still suppresses spurious setActive while realIdx hasn't caught
    // up to the optimistic activeIdx (= 1).
    setScrollLeft(viewport, WIDTH);
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    expect(onChange).not.toHaveBeenCalled();

    // And a subsequent scroll past the natural wrap edge (e.g. on the
    // NEXT wrap cycle, with the guard already cleared) still snaps
    // normally. Use the clone-end snap path to prove the edge branch
    // is reachable again.
    setScrollLeft(viewport, (N + 1) * WIDTH);
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    // domIdx = N + 1; goToInProgressRef + scrollLeft check passes (no
    // tolerance miss); snap to DOM index 1; setActive(0). activeIdx was
    // already 1 from click 2, so onChange(0) IS emitted by the snap.
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('sweep variant: next-arrow wrap targets the real first, not the clone', async () => {
    const five = ['A', 'B', 'C', 'D', 'E'];
    const N = five.length;
    const scrollTo = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
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
    setWidth(viewport);
    scrollTo.mockClear();
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    const smooth = leftsBy(scrollTo, 'smooth');
    expect(smooth).toHaveLength(1);
    // Sweep mode keeps the pre-fix behavior: smooth-scroll all the way
    // back to DOM index 1 (the real first), traversing every intermediate
    // slide. NOT DOM index N + 1 (the clone).
    expect(smooth[0]).toBe(1 * WIDTH);
    expect(smooth[0]).not.toBe((N + 1) * WIDTH);
  });

  it('sweep variant: prev-arrow wrap targets the real last, not the clone', async () => {
    const five = ['A', 'B', 'C', 'D', 'E'];
    const N = five.length;
    const scrollTo = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
    const { container } = render(
      <Carousel
        items={five}
        defaultIndex={0}
        loop="sweep"
        renderItem={(v) => <div>{v}</div>}
        aria-label="Photos"
      />,
    );
    const viewport = container.querySelector('[aria-live="polite"]') as HTMLElement;
    setWidth(viewport);
    scrollTo.mockClear();
    await userEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    const smooth = leftsBy(scrollTo, 'smooth');
    expect(smooth).toHaveLength(1);
    // Sweep mode keeps the pre-fix behavior: smooth-scroll all the way
    // forward to DOM index N (the real last), traversing every
    // intermediate slide. NOT DOM index 0 (the leading clone).
    expect(smooth[0]).toBe(N * WIDTH);
    expect(smooth[0]).not.toBe(0);
  });

  it('targets the real twin directly for mid-strip dot jumps when loop is on', async () => {
    const five = ['A', 'B', 'C', 'D', 'E'];
    const scrollTo = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
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
    setWidth(viewport);
    scrollTo.mockClear();
    // Jump from slide 0 to slide 2 via its dot — not a wrap step, so the
    // smooth scroll should still land on the real twin (DOM index 3 when
    // looping, since DOM 0 is the leading clone).
    await userEvent.click(screen.getByRole('button', { name: 'Go to slide 3' }));
    const smooth = leftsBy(scrollTo, 'smooth');
    expect(smooth).toHaveLength(1);
    expect(smooth[0]).toBe(3 * WIDTH);
  });

  it('defers the clone-end snap until the wrap scroll has fully landed', async () => {
    const scrollTo = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
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
    setWidth(viewport);
    await userEvent.click(screen.getByRole('button', { name: 'Next slide' }));

    // Midway through the wrap animation: scrollLeft rounds to N + 1, but
    // the smooth scroll hasn't actually landed yet. Snapping here would
    // cancel the animation and produce the half-slide-then-teleport
    // flicker the user reported.
    scrollTo.mockClear();
    setScrollLeft(viewport, (N + 0.6) * WIDTH);
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    expect(leftsBy(scrollTo, 'instant')).toHaveLength(0);

    // Animation lands on the clone position. Now the snap should fire,
    // jumping to DOM index 1 (the real first).
    setScrollLeft(viewport, (N + 1) * WIDTH);
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    expect(leftsBy(scrollTo, 'instant')[0]).toBe(1 * WIDTH);
  });

  it('still snaps from clone-end to the real first on native-swipe wrap', () => {
    const five = ['A', 'B', 'C', 'D', 'E'];
    const N = five.length;
    const scrollTo = vi.spyOn(Element.prototype, 'scrollTo').mockImplementation(() => {});
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
    setWidth(viewport);
    setScrollLeft(viewport, WIDTH * (N + 1));
    scrollTo.mockClear();
    act(() => {
      viewport.dispatchEvent(new Event('scroll'));
    });
    const instant = leftsBy(scrollTo, 'instant');
    expect(instant.length).toBeGreaterThan(0);
    // The snap from clone-end (DOM index N + 1) lands on the real first
    // (DOM index 1). This is the native-swipe path — must not regress.
    expect(instant[0]).toBe(1 * WIDTH);
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
