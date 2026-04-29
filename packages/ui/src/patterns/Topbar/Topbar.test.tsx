import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Topbar } from './Topbar';

describe('Topbar', () => {
  it('renders the title', () => {
    render(<Topbar title="Graph Explorer" />);
    expect(screen.getByText('Graph Explorer')).toBeInTheDocument();
  });

  it('renders actions', () => {
    render(<Topbar title="App" actions={<button>Settings</button>} />);
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Topbar title="Graph Explorer" actions={<button aria-label="Settings">⚙</button>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
