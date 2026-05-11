'use client';

import { Tab, Tabs, TabsContent, TabsList } from '@ship-it-ui/ui';
import { Suspense } from 'react';


import { CodeBlockStatic } from './CodeBlockStatic';

import { examples } from '@/.generated/examples';

interface Props {
  /** Slug into the examples registry, e.g. `button/primary`. */
  example: string;
}

/**
 * Renders an example component side-by-side with its real source. The registry
 * (`.generated/examples.ts`, written by `scripts/build-examples-registry.ts`)
 * maps slugs to `{ Component, source }` so MDX authors only ever reference a
 * slug — never an import path.
 */
export function LivePreview({ example }: Props) {
  const entry = examples[example];
  if (!entry) {
    return (
      <div className="border-err bg-err/10 text-err rounded-base my-4 border p-3 text-[12px]">
        Unknown example: <code className="font-mono">{example}</code>
      </div>
    );
  }
  const { Component, source } = entry;
  return (
    <div className="border-border rounded-base my-6 overflow-hidden border">
      <Tabs defaultValue="preview">
        <div className="border-border bg-panel-2 border-b px-3">
          <TabsList>
            <Tab value="preview">Preview</Tab>
            <Tab value="code">Code</Tab>
          </TabsList>
        </div>
        <TabsContent value="preview">
          <div className="bg-bg flex min-h-[140px] items-center justify-center p-6">
            <Suspense fallback={<div className="text-text-dim text-[12px]">Loading…</div>}>
              <Component />
            </Suspense>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlockStatic source={source} language="tsx" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
