import { Rating } from '@ship-it-ui/ui';

export default function Example() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Rating value={4.5} precision="half" size="sm" readOnly />
      <Rating value={4.5} precision="half" size="md" readOnly />
      <Rating value={4.5} precision="half" size="lg" readOnly />
    </div>
  );
}
