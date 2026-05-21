import { NumberInput } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <NumberInput defaultValue={1} size="sm" aria-label="Small" />
      <NumberInput defaultValue={1} size="md" aria-label="Medium" />
      <NumberInput defaultValue={1} size="lg" aria-label="Large" />
    </div>
  );
}
