import { Tab, Tabs, TabsContent, TabsList } from "@ship-it-ui/ui";

export default function Example() {
    const args = {
        variant: 'underline',
        defaultValue: 'overview',
    } as const;
    return (
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
    );
}

