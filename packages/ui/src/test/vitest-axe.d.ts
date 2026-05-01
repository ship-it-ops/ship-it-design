// vitest-axe@0.1.0 augments the deprecated `Vi.Assertion` namespace; modern
// Vitest exposes `Assertion` directly off the `vitest` module. Without this
// the matcher is registered at runtime (via setup.ts) but invisible to TS,
// breaking `expect(await axe(container)).toHaveNoViolations()` in tests.
import 'vitest';

declare module 'vitest' {
  interface Assertion<T = unknown> {
    toHaveNoViolations(): T;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): unknown;
  }
}
