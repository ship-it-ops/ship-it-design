import type { Meta, StoryObj } from '@storybook/react-vite';

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
      <TabsContent value="overview" className="text-text-muted pt-3 text-[13px]">
        Overview content.
      </TabsContent>
      <TabsContent value="properties" className="text-text-muted pt-3 text-[13px]">
        Properties content.
      </TabsContent>
      <TabsContent value="relations" className="text-text-muted pt-3 text-[13px]">
        Relations content.
      </TabsContent>
      <TabsContent value="history" className="text-text-muted pt-3 text-[13px]">
        History content.
      </TabsContent>
      <TabsContent value="code" className="text-text-muted pt-3 text-[13px]">
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
      <TabsContent value="graph" className="text-text-muted pt-3 text-[13px]">
        Graph view.
      </TabsContent>
      <TabsContent value="list" className="text-text-muted pt-3 text-[13px]">
        List view.
      </TabsContent>
      <TabsContent value="table" className="text-text-muted pt-3 text-[13px]">
        Table view.
      </TabsContent>
    </Tabs>
  ),
};
