import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';
import 'vitest-axe/extend-expect';

// vitest-axe registers `toHaveNoViolations` against Vitest's expect.
expect.extend(axeMatchers);

// Suppress a noisy upstream act() warning from `@radix-ui/react-toast`:
// `ToastAnnounce` schedules a 1-second `setTimeout` to flip its
// `isAnnounced` state, and that timer fires after the test body has moved
// on — outside React's act scope. We can't wrap it from user-land, and
// using fake timers across every Toast test is invasive. Filter only this
// exact message so genuine act warnings still surface.
const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  const first = args[0];
  if (
    typeof first === 'string' &&
    first.includes('An update to ToastAnnounce inside a test was not wrapped in act')
  ) {
    return;
  }
  originalConsoleError(...args);
};

// jsdom polyfills — Radix primitives reach for browser APIs jsdom doesn't ship.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [] as IntersectionObserverEntry[];
  }
  root = null;
  rootMargin = '';
  thresholds: number[] = [];
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});
Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Radix DropdownMenu/Select use scrollIntoView; jsdom doesn't implement it.
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

// Radix Slider uses pointer-capture APIs jsdom doesn't define.
if (typeof HTMLElement !== 'undefined' && !HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = vi.fn();
}
if (typeof HTMLElement !== 'undefined' && !HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = vi.fn();
}

afterEach(() => {
  cleanup();
});
