import { ComparisonTable, type ComparisonOption, type ComparisonRow } from '@ship-it-ui/ui';

const options: ComparisonOption[] = [
  { id: 'ship-it', name: 'ShipIt', url: 'https://ship.it' },
  { id: 'rival-a', name: 'Rival A' },
  { id: 'rival-b', name: 'Rival B' },
];

const rows: ComparisonRow[] = [
  {
    feature: 'Server-side rendering',
    values: { 'ship-it': true, 'rival-a': true, 'rival-b': false },
  },
  { feature: 'Edge runtime', values: { 'ship-it': true, 'rival-a': false, 'rival-b': false } },
  { feature: 'Dark-first theme', values: { 'ship-it': true, 'rival-a': false, 'rival-b': true } },
  { feature: 'Schema.org markup', values: { 'ship-it': true, 'rival-a': false, 'rival-b': false } },
];

export default function Example() {
  return (
    <div className="rounded-base border-border bg-panel overflow-hidden border">
      <ComparisonTable
        caption="Capabilities compared across ShipIt and competitors."
        options={options}
        rows={rows}
        schema="SoftwareApplication"
      />
    </div>
  );
}
