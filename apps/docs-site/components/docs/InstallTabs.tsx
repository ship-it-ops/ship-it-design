'use client';

import { Tab, Tabs, TabsContent, TabsList } from '@ship-it-ui/ui';

import { CodeBlockStatic } from './CodeBlockStatic';

interface Props {
  pkg: string;
}

const COMMANDS = (pkg: string) => ({
  pnpm: `pnpm add ${pkg}`,
  npm: `npm install ${pkg}`,
  yarn: `yarn add ${pkg}`,
  bun: `bun add ${pkg}`,
});

export function InstallTabs({ pkg }: Props) {
  const c = COMMANDS(pkg);
  return (
    <div className="border-border rounded-base my-4 overflow-hidden border">
      <Tabs defaultValue="pnpm">
        <div className="border-border bg-panel-2 border-b px-3">
          <TabsList>
            <Tab value="pnpm">pnpm</Tab>
            <Tab value="npm">npm</Tab>
            <Tab value="yarn">yarn</Tab>
            <Tab value="bun">bun</Tab>
          </TabsList>
        </div>
        <TabsContent value="pnpm">
          <CodeBlockStatic source={c.pnpm} language="bash" />
        </TabsContent>
        <TabsContent value="npm">
          <CodeBlockStatic source={c.npm} language="bash" />
        </TabsContent>
        <TabsContent value="yarn">
          <CodeBlockStatic source={c.yarn} language="bash" />
        </TabsContent>
        <TabsContent value="bun">
          <CodeBlockStatic source={c.bun} language="bash" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
