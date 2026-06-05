import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { ConnectorCard } from './ConnectorCard';

const NOW = new Date('2026-05-10T12:00:00Z');

describe('ConnectorCard', () => {
  it('renders the connector name', () => {
    render(<ConnectorCard connector="github" name="GitHub" status="connected" />);
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('renders the human status label', () => {
    render(<ConnectorCard connector="github" name="GitHub" status="error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('formats the relative last-synced time', () => {
    render(
      <ConnectorCard
        connector="notion"
        name="Notion"
        status="connected"
        lastSyncedAt={new Date('2026-05-10T11:30:00Z')}
        relativeNow={NOW}
      />,
    );
    expect(screen.getByText(/last synced 30m ago/)).toBeInTheDocument();
  });

  it('fires onClick when the card is activated', async () => {
    const onClick = vi.fn();
    render(<ConnectorCard connector="slack" name="Slack" status="connected" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Slack connector' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not bubble action clicks to the card', async () => {
    const onClick = vi.fn();
    const onAction = vi.fn();
    render(
      <ConnectorCard
        connector="linear"
        name="Linear"
        status="connected"
        onClick={onClick}
        actions={<button onClick={onAction}>Manage</button>}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Manage' }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('has no a11y violations when interactive + actions are combined', async () => {
    const { container } = render(
      <ConnectorCard
        connector="github"
        name="GitHub"
        status="connected"
        onClick={() => {}}
        actions={<button>Manage</button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('uses the accessibleName fallback when name is not a string', async () => {
    const { container } = render(
      <ConnectorCard
        connector="github"
        name={<span>GitHub</span>}
        status="connected"
        onClick={() => {}}
        accessibleName="GitHub connector"
      />,
    );
    expect(screen.getByRole('button', { name: 'GitHub connector' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <ConnectorCard
        connector="github"
        name="GitHub"
        status="connected"
        lastSyncedAt={new Date('2026-05-10T08:00:00Z')}
        relativeNow={NOW}
        summary="1,243 repos"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('emits a SoftwareApplication JSON-LD with name, dateModified, and consumer-supplied extras', () => {
    const { container } = render(
      <ConnectorCard
        connector="github"
        name="GitHub"
        status="connected"
        lastSyncedAt={new Date('2026-05-10T08:00:00Z')}
        relativeNow={NOW}
        applicationCategory="DeveloperApplication"
        url="https://ship.it/connectors/github"
        softwareVersion="2.1.0"
      />,
    );
    const parsed = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );
    expect(parsed).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'GitHub',
      applicationCategory: 'DeveloperApplication',
      url: 'https://ship.it/connectors/github',
      softwareVersion: '2.1.0',
      dateModified: '2026-05-10T08:00:00.000Z',
    });
  });

  it('skips JSON-LD when name is JSX without nameText fallback', () => {
    const { container } = render(
      <ConnectorCard connector="github" name={<span>GitHub</span>} status="connected" />,
    );
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('uses nameText fallback when name is JSX', () => {
    const { container } = render(
      <ConnectorCard
        connector="github"
        name={<span>GitHub</span>}
        nameText="GitHub"
        status="connected"
      />,
    );
    const parsed = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );
    expect(parsed.name).toBe('GitHub');
  });

  it('omits the JSON-LD script when noStructuredData is set', () => {
    const { container } = render(
      <ConnectorCard connector="github" name="GitHub" status="connected" noStructuredData />,
    );
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('escapes </script> in name', () => {
    const { container } = render(
      <ConnectorCard
        connector="github"
        name={'</script><img onerror=alert(1)>'}
        status="connected"
      />,
    );
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(script.innerHTML).not.toMatch(/<\/script>/i);
    expect(script.innerHTML).toContain('\\u003c/script>');
  });
});
