import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Card } from './Card';
import { StatCard } from './StatCard';

describe('Card', () => {
  it('renders title, description, and children', () => {
    render(
      <Card title="Hello" description="World">
        Body
      </Card>,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('fires onClick when interactive', async () => {
    const handle = vi.fn();
    render(<Card title="x" onClick={handle} />);
    await userEvent.click(screen.getByText('x'));
    expect(handle).toHaveBeenCalled();
  });

  it('renders an actions slot in the header', () => {
    render(<Card title="x" actions={<button>Edit</button>} />);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('renders a footer slot', () => {
    render(<Card title="x" footer="updated 2m ago" />);
    expect(screen.getByText('updated 2m ago')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <Card title="x" description="y">
        body
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('StatCard', () => {
  it('renders label, value, and delta', () => {
    render(<StatCard label="Entities" value="12,408" delta="+284 today" trend="up" />);
    expect(screen.getByText('Entities')).toBeInTheDocument();
    expect(screen.getByText('12,408')).toBeInTheDocument();
    expect(screen.getByText('↑ +284 today')).toBeInTheDocument();
  });

  it('renders the icon slot when provided', () => {
    render(<StatCard label="x" value="0" icon={<span>📊</span>} />);
    expect(screen.getByText('📊')).toBeInTheDocument();
  });
});
