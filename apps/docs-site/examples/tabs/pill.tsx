import { Tab, Tabs, TabsContent, TabsList } from '@ship-it-ui/ui';

export default function Example() {
  const args = {
    variant: 'pill',
    defaultValue: 'graph',
  } as const;
  return (
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
  );
}
