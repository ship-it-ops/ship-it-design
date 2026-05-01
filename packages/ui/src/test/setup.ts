import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';
import { afterEach, expect } from 'vitest';

// Register `jest-axe`'s matcher against Vitest's expect so component tests can
// call `expect(await axe(container)).toHaveNoViolations()`. Without this the
// matcher resolves to undefined and Vitest throws "Invalid Chai property".
expect.extend(toHaveNoViolations);

afterEach(() => {
  cleanup();
});
