import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Tab, Tabs, TabsContent, TabsList } from './Tabs';

function Sample({ variant }: { variant?: 'underline' | 'pill' }) {
  return (
    <Tabs defaultValue="overview" variant={variant}>
      <TabsList aria-label="Sections">
        <Tab value="overview">Overview</Tab>
        <Tab value="properties">Properties</Tab>
      </TabsList>
      <TabsContent value="overview">overview-panel</TabsContent>
      <TabsContent value="properties">properties-panel</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders the active panel', () => {
    render(<Sample />);
    expect(screen.getByText('overview-panel')).toBeInTheDocument();
  });

  it('switches panels on click', async () => {
    render(<Sample />);
    await userEvent.click(screen.getByRole('tab', { name: 'Properties' }));
    expect(screen.getByText('properties-panel')).toBeInTheDocument();
  });

  it('has no a11y violations (underline)', async () => {
    const { container } = render(<Sample />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no a11y violations (pill)', async () => {
    const { container } = render(<Sample variant="pill" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
