import { ComparisonTable, type ComparisonOption, type ComparisonRow } from '@ship-it-ui/ui';

const options: ComparisonOption[] = [
  { id: 'a', name: 'Model A', featured: true, badge: 'NEW' },
  { id: 'b', name: 'Model B' },
];

const rows: ComparisonRow[] = [
  {
    group: 'Display',
    feature: 'Resolution',
    values: { a: '3024 × 1964', b: '2560 × 1600' },
  },
  {
    group: 'Display',
    feature: 'Refresh rate',
    values: { a: { value: '120 Hz', note: 'ProMotion' }, b: '60 Hz' },
  },
  { group: 'Display', feature: 'HDR', values: { a: true, b: false } },
  {
    group: 'Performance',
    feature: 'CPU',
    description: 'Single-core score (higher is better)',
    values: { a: 2890, b: 2240 },
  },
  {
    group: 'Performance',
    feature: 'Memory',
    values: { a: '16 GB', b: '8 GB' },
  },
  {
    group: 'Connectivity',
    feature: 'Thunderbolt 4',
    values: { a: true, b: false },
  },
  {
    group: 'Connectivity',
    feature: 'Wi-Fi 7',
    values: { a: true, b: false },
  },
];

export default function Example() {
  return (
    <div className="rounded-base border-border bg-panel overflow-hidden border">
      <ComparisonTable
        caption="Hardware specs for Model A vs Model B."
        options={options}
        rows={rows}
        schema="Product"
        density="compact"
      />
    </div>
  );
}
