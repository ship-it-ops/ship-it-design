import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { DialogDescription, DialogTitle } from '../Dialog';

import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders its children in the document', () => {
    render(<VisuallyHidden>Close menu</VisuallyHidden>);
    expect(screen.getByText('Close menu')).toBeInTheDocument();
  });

  it('forwards a ref to the rendered span', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<VisuallyHidden ref={ref}>Hidden</VisuallyHidden>);
    expect(ref.current).toBe(screen.getByText('Hidden'));
    expect(ref.current?.tagName).toBe('SPAN');
  });

  it('applies the clip-based screen-reader-only styles', () => {
    render(<VisuallyHidden>Hidden</VisuallyHidden>);
    const span = screen.getByText('Hidden');
    expect(span).toHaveStyle({ position: 'absolute', width: '1px', height: '1px' });
  });

  it('re-exports DialogTitle and DialogDescription from the Dialog barrel', () => {
    expect(DialogTitle).toBeDefined();
    expect(DialogDescription).toBeDefined();
  });
});
