import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { LargeTitle } from './LargeTitle';

describe('LargeTitle', () => {
  it('renders the title as an h1', () => {
    render(<LargeTitle title="Morning, Mo." />);
    expect(screen.getByRole('heading', { level: 1, name: 'Morning, Mo.' })).toBeInTheDocument();
  });

  it('renders the eyebrow when supplied', () => {
    render(<LargeTitle title="Hi" eyebrow="Tuesday · May 12" />);
    expect(screen.getByText('Tuesday · May 12')).toBeInTheDocument();
  });

  it('renders the trailing slot', () => {
    render(<LargeTitle title="Hi" trailing={<button type="button">Avatar</button>} />);
    expect(screen.getByRole('button', { name: 'Avatar' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <LargeTitle title="Welcome" eyebrow="ONBOARDING" trailing={<span>🙂</span>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
