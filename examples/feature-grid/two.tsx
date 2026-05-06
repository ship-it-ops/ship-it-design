import { FeatureGrid } from '@ship-it-ui/shipit';
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

export default function Example() {
  return <FeatureGrid features={features.slice(0, 4)} columns={2} />;
}
