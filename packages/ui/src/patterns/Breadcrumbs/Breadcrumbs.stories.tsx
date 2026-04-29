import type { Meta, StoryObj } from '@storybook/react';

import { Breadcrumbs, Crumb } from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Patterns/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: () => (
    <Breadcrumbs>
      <Crumb href="/">Workspace</Crumb>
      <Crumb href="/graph">Graph</Crumb>
      <Crumb href="/graph/services">Services</Crumb>
      <Crumb>payment-webhook</Crumb>
    </Breadcrumbs>
  ),
};

export const ChevronSeparator: Story = {
  render: () => (
    <Breadcrumbs separator={<span className="font-mono">›</span>}>
      <Crumb href="/">~</Crumb>
      <Crumb href="/workspace">workspace</Crumb>
      <Crumb href="/workspace/graph">graph</Crumb>
      <Crumb>payment-webhook</Crumb>
    </Breadcrumbs>
  ),
};
