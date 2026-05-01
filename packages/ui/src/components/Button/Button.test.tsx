import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('uses type="button" by default and allows explicit type overrides', () => {
    render(
      <>
        <Button>Default</Button>
        <Button type="submit">Submit</Button>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Default' })).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit');
  });

  it('forwards refs to the rendered button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Focusable</Button>);

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Focusable' }));
  });

  it('fires onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom classes and does not leak variant/size as DOM attributes', () => {
    render(
      <Button variant="secondary" size="lg" className="custom-class">
        Styled
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Styled' });
    expect(button).toHaveClass('custom-class');
    expect(button).not.toHaveAttribute('variant');
    expect(button).not.toHaveAttribute('size');
  });

  it('renders the polymorphic child when asChild is set', () => {
    render(
      <Button asChild>
        <a href="/home">Home</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '/home');
    expect(link).not.toHaveAttribute('type');
  });

  it('has no accessibility violations for button and asChild link variants', async () => {
    const { container } = render(
      <>
        <Button>Accessible</Button>
        <Button asChild>
          <a href="/docs">Docs</a>
        </Button>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
