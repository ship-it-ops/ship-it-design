import { Carousel } from '@ship-it-ui/ui';

const slides = [
  { color: 'oklch(0.7 0.15 30)', label: 'Front' },
  { color: 'oklch(0.7 0.15 130)', label: 'Side' },
  { color: 'oklch(0.7 0.15 230)', label: 'Interior' },
  { color: 'oklch(0.7 0.15 330)', label: 'Trunk' },
];

export default function Example() {
  return (
    <Carousel
      items={slides}
      aria-label="Vehicle photos"
      renderItem={(s) => (
        <div
          style={{
            background: s.color,
            color: '#0a0a0b',
            display: 'grid',
            placeItems: 'center',
            fontSize: 16,
            fontWeight: 600,
            height: '100%',
          }}
        >
          {s.label}
        </div>
      )}
      renderThumbnail={(s) => (
        <div
          style={{
            width: 64,
            height: 40,
            background: s.color,
          }}
        />
      )}
    />
  );
}
