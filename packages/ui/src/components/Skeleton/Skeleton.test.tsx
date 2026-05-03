import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Skeleton, SkeletonGroup } from './Skeleton';

describe('Skeleton', () => {
  it('is aria-hidden by default so a list of skeletons does not over-announce', () => {
    const { container } = render(<Skeleton width="50%" />);
    const el = container.firstElementChild!;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el).not.toHaveAttribute('role');
  });

  it('exposes role="status" + aria-busy when standalone', () => {
    render(<Skeleton width="50%" standalone />);
    const el = screen.getByRole('status');
    expect(el).toHaveAttribute('aria-busy', 'true');
    expect(el).toHaveAttribute('aria-label', 'Loading');
  });

  it('uses height for both dimensions in circle shape', () => {
    const { container } = render(<Skeleton shape="circle" height={48} />);
    expect(container.firstElementChild).toHaveStyle({ width: '48px', height: '48px' });
  });

  it('renders the block shape with default height', () => {
    const { container } = render(<Skeleton shape="block" />);
    expect(container.firstElementChild).toHaveStyle({ height: '80px' });
  });

  it('has no a11y violations standalone', async () => {
    const { container } = render(<Skeleton width="50%" standalone />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('SkeletonGroup', () => {
  it('emits one aggregate live region for all child skeletons', () => {
    render(
      <SkeletonGroup>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </SkeletonGroup>,
    );
    const regions = screen.getAllByRole('status');
    expect(regions).toHaveLength(1);
    expect(regions[0]).toHaveAttribute('aria-busy', 'true');
    expect(regions[0]).toHaveAttribute('aria-label', 'Loading');
  });

  it('accepts a custom label', () => {
    render(
      <SkeletonGroup label="Loading inbox">
        <Skeleton />
      </SkeletonGroup>,
    );
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading inbox');
  });

  it('renders no live region when loading={false}', () => {
    render(
      <SkeletonGroup loading={false}>
        <Skeleton />
      </SkeletonGroup>,
    );
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <SkeletonGroup>
        <Skeleton />
        <Skeleton />
      </SkeletonGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
