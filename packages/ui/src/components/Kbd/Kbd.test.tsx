import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Kbd } from './Kbd';

describe('Kbd', () => {
  it('renders as a <kbd> element', () => {
    render(<Kbd>K</Kbd>);
    const el = screen.getByText('K');
    expect(el.tagName).toBe('KBD');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Kbd>⌘</Kbd>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
