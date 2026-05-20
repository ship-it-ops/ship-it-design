import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';
import 'vitest-axe/extend-expect';

expect.extend(axeMatchers);

afterEach(() => {
  cleanup();
});

// React Flow needs browser APIs jsdom doesn't ship. Minimal shims so the
// component tree can mount; we don't assert on layout, just structure.

class ResizeObserverStub {
  observe() {
    /* noop */
  }
  unobserve() {
    /* noop */
  }
  disconnect() {
    /* noop */
  }
}

class DOMMatrixReadOnlyStub {
  m22 = 1;
  // RF uses DOMMatrixReadOnly for zoom transforms; the m22 field is the
  // vertical scale factor it reads to detect zoom level. 1 = identity.
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  (globalThis as unknown as { ResizeObserver: typeof ResizeObserverStub }).ResizeObserver =
    ResizeObserverStub;
}

if (typeof globalThis.DOMMatrixReadOnly === 'undefined') {
  (globalThis as unknown as { DOMMatrixReadOnly: unknown }).DOMMatrixReadOnly =
    DOMMatrixReadOnlyStub;
}

// React Flow reads `Element.prototype.getBoundingClientRect()` to position
// nodes. jsdom returns all zeros which makes RF skip rendering. The test file
// stubs this per-test; here we ensure `Element.prototype.contains` and
// related dom methods do exist.
