import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Lightbox } from './Lightbox';

const photos = ['p1', 'p2', 'p3'];

describe('Lightbox', () => {
  it('renders the active photo when open', () => {
    render(<Lightbox open items={photos} renderItem={(p) => <img alt={`Slide ${p}`} />} />);
    expect(screen.getByAltText('Slide p1')).toBeInTheDocument();
  });

  it('advances on right-arrow click', async () => {
    const handle = vi.fn();
    render(
      <Lightbox
        open
        items={photos}
        defaultIndex={0}
        onIndexChange={handle}
        renderItem={(p) => <img alt={`Slide ${p}`} />}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Next photo' }));
    expect(handle).toHaveBeenLastCalledWith(1);
  });

  it('disables Prev at index 0 and Next at the last index', () => {
    render(
      <Lightbox
        open
        items={photos}
        defaultIndex={0}
        renderItem={(p) => <img alt={`Slide ${p}`} />}
      />,
    );
    expect(screen.getByRole('button', { name: 'Previous photo' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next photo' })).not.toBeDisabled();
  });

  it('shows a counter overlay', () => {
    render(
      <Lightbox
        open
        items={photos}
        defaultIndex={1}
        renderItem={(p) => <img alt={`Slide ${p}`} />}
      />,
    );
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('wraps next past the last item when loop is on', async () => {
    render(
      <Lightbox
        open
        loop
        items={photos}
        defaultIndex={2}
        renderItem={(p) => <img alt={`Slide ${p}`} />}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Next photo' }));
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('wraps prev past index 0 when loop is on', async () => {
    render(
      <Lightbox
        open
        loop
        items={photos}
        defaultIndex={0}
        renderItem={(p) => <img alt={`Slide ${p}`} />}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Previous photo' }));
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });

  it('wraps ←/→ keyboard navigation when loop is on', () => {
    render(
      <Lightbox
        open
        loop
        items={photos}
        defaultIndex={0}
        renderItem={(p) => <img alt={`Slide ${p}`} />}
      />,
    );
    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'ArrowLeft' });
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: 'ArrowRight' });
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('keeps prev/next enabled at the boundaries when loop is on', () => {
    render(
      <Lightbox
        open
        loop
        items={photos}
        defaultIndex={0}
        renderItem={(p) => <img alt={`Slide ${p}`} />}
      />,
    );
    expect(screen.getByRole('button', { name: 'Previous photo' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next photo' })).not.toBeDisabled();
  });

  it('has no a11y violations when open', async () => {
    const { container } = render(
      <Lightbox open items={photos} renderItem={(p) => <img alt={`Slide ${p}`} />} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
