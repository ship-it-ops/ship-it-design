import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';
import 'vitest-axe/extend-expect';

// vitest-axe registers `toHaveNoViolations` against Vitest's expect.
expect.extend(axeMatchers);

afterEach(() => {
  cleanup();
});
