import type { Meta, StoryObj } from '@storybook/react-vite';

import { FeatureGrid } from './FeatureGrid';

const meta: Meta<typeof FeatureGrid> = {
  title: 'ShipIt/Marketing/FeatureGrid',
  component: FeatureGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof FeatureGrid>;

const features = [
  {
    glyph: '◇',
    title: 'Live graph',
    description: 'Append-only, time-indexed. Scrub history, diff schemas, roll back extractions.',
  },
  {
    glyph: '✦',
    title: 'Ask anything',
    description: 'Natural-language queries over the graph — with citations back to source lines.',
  },
  {
    glyph: '↗',
    title: 'Ingest everything',
    description: 'GitHub, Notion, Slack, Jira, PagerDuty, Linear. All in your VPC.',
  },
  {
    glyph: '!',
    title: 'Incident-first',
    description: 'Pin services + runbooks. When paged, the answer is already loaded.',
  },
  {
    glyph: '◉',
    title: 'SOC 2 ready',
    description: 'Audit log on every query. Redactions enforced at ingest.',
  },
  { glyph: '▢', title: 'Open schema', description: 'Your graph, exportable. No vendor lock.' },
];

export const Three: Story = { args: { features, columns: 3 } };
export const Two: Story = { args: { features: features.slice(0, 4), columns: 2 } };
