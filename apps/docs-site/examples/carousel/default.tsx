import { Carousel } from '@ship-it-ui/ui';

const slides = [
  { color: 'oklch(0.7 0.15 30)', label: 'Tesla Model 3' },
  { color: 'oklch(0.7 0.15 130)', label: 'Jeep Wrangler' },
  { color: 'oklch(0.7 0.15 230)', label: 'BMW i4' },
  { color: 'oklch(0.7 0.15 330)', label: 'Ford F-150' },
];

export default function Example() {
  return (
    <Carousel
      items={slides}
      aria-label="Featured vehicles"
      renderItem={(s) => (
        <div
          style={{
            background: s.color,
            color: '#0a0a0b',
            display: 'grid',
            placeItems: 'center',
            fontSize: 18,
            fontWeight: 600,
            height: '100%',
          }}
        >
          {s.label}
        </div>
      )}
    />
  );
}
