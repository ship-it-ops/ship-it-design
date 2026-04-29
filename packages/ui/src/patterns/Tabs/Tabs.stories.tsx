import type { Meta, StoryObj } from '@storybook/react';

import { Tab, Tabs, TabsContent, TabsList } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Patterns/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['underline', 'pill'] },
  },
  args: { variant: 'underline', defaultValue: 'overview' },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Underline: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="Tabs">
        <Tab value="overview">Overview</Tab>
        <Tab value="properties">Properties</Tab>
        <Tab value="relations">Relations</Tab>
        <Tab value="history">History</Tab>
        <Tab value="code">Code</Tab>
      </TabsList>
      <TabsContent value="overview" className="pt-3 text-[13px] text-text-muted">
        Overview content.
      </TabsContent>
      <TabsContent value="properties" className="pt-3 text-[13px] text-text-muted">
        Properties content.
      </TabsContent>
      <TabsContent value="relations" className="pt-3 text-[13px] text-text-muted">
        Relations content.
      </TabsContent>
      <TabsContent value="history" className="pt-3 text-[13px] text-text-muted">
        History content.
      </TabsContent>
      <TabsContent value="code" className="pt-3 text-[13px] text-text-muted">
        Code content.
      </TabsContent>
    </Tabs>
  ),
};

export const Pill: Story = {
  args: { variant: 'pill', defaultValue: 'graph' },
  render: (args) => (
    <Tabs {...args}>
      <TabsList aria-label="View">
        <Tab value="graph">Graph</Tab>
        <Tab value="list">List</Tab>
        <Tab value="table">Table</Tab>
      </TabsList>
      <TabsContent value="graph" className="pt-3 text-[13px] text-text-muted">
        Graph view.
      </TabsContent>
      <TabsContent value="list" className="pt-3 text-[13px] text-text-muted">
        List view.
      </TabsContent>
      <TabsContent value="table" className="pt-3 text-[13px] text-text-muted">
        Table view.
      </TabsContent>
    </Tabs>
  ),
};
