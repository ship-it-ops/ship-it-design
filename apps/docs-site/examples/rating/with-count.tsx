import { Rating } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <Rating value={4.7} precision="half" readOnly />
      <span style={{ fontSize: 13, color: 'var(--color-text)' }}>4.7</span>
      <span style={{ fontSize: 13, color: 'var(--color-text-dim)' }}>(238 trips)</span>
    </div>
  );
}
