'use client';
import { Map } from '@ship-it-ui/map';

const markers = [
  { id: 'a', location: [-122.4194, 37.7749] as const, label: '$89', icon: 'car' as const },
  { id: 'b', location: [-122.41, 37.78] as const, label: '$74', icon: 'car' as const },
  {
    id: 'c',
    location: [-122.43, 37.77] as const,
    label: '$112',
    icon: 'car' as const,
    variant: 'accent' as const,
  },
];

export default function Example() {
  return (
    <Map
      center={[-122.4194, 37.7749]}
      zoom={12}
      markers={markers}
      aria-label="Cars near San Francisco"
      style={{ height: 400, borderRadius: 8, overflow: 'hidden' }}
    />
  );
}
