import { SegmentedControl } from '@ship-it-ui/ui';

const opts = [
  { value: 'a', label: 'One' },
  { value: 'b', label: 'Two' },
  { value: 'c', label: 'Three' },
];

export default function Example() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <SegmentedControl options={opts} defaultValue="a" size="sm" aria-label="Sm" />
      <SegmentedControl options={opts} defaultValue="a" size="md" aria-label="Md" />
    </div>
  );
}
