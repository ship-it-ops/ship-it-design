import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Card, CardLink } from './Card';
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
    expect(handle).toHaveBeenCalledTimes(1);
  });

  it('renders an actions slot in the header', () => {
    render(<Card title="x" actions={<button>Edit</button>} />);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('renders a footer slot', () => {
    render(<Card title="x" footer="updated 2m ago" />);
    expect(screen.getByText('updated 2m ago')).toBeInTheDocument();
  });

  describe('keyboard activation', () => {
    it('prefers onActivate over onClick when both are set', async () => {
      const onActivate = vi.fn();
      const onClick = vi.fn();
      render(<Card title="x" onClick={onClick} onActivate={onActivate} />);
      const card = screen.getByRole('button', { name: 'x' });
      card.focus();
      await userEvent.keyboard('{Enter}');
      expect(onActivate).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('falls back to onClick when onActivate is not provided', async () => {
      const onClick = vi.fn();
      render(<Card title="x" onClick={onClick} />);
      const card = screen.getByRole('button', { name: 'x' });
      card.focus();
      await userEvent.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('nested-interactive guard', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    afterEach(() => {
      warn.mockClear();
    });

    it('drops role="button" when actions are present and warns in dev', () => {
      render(
        <Card interactive title="x" actions={<button>Edit</button>}>
          body
        </Card>,
      );
      // The card itself is no longer a button — only the inner Edit button is.
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveTextContent('Edit');
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0]?.[0]).toMatch(/nested-interactive/);
    });

    it('has no a11y violations in the actions+interactive fallback', async () => {
      const { container } = render(
        <Card interactive title="x" actions={<button>Edit</button>}>
          body
        </Card>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
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

describe('CardLink', () => {
  it('renders the entire card as a single link', () => {
    render(
      <CardLink href="/services/payments" title="Payments" description="Webhook service">
        body
      </CardLink>,
    );
    const link = screen.getByRole('link', { name: /payments/i });
    expect(link).toHaveAttribute('href', '/services/payments');
    expect(link).toHaveTextContent('Webhook service');
    expect(link).toHaveTextContent('body');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <CardLink href="/x" title="x" description="y">
        body
      </CardLink>,
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
