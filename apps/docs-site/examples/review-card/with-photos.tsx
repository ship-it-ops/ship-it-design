import { ReviewCard } from '@ship-it-ui/ui';

const photos = [
  'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="oklch(0.7 0.18 230)"/></svg>',
    ),
  'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="oklch(0.7 0.18 130)"/></svg>',
    ),
  'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="oklch(0.7 0.18 30)"/></svg>',
    ),
];

export default function Example() {
  return (
    <div style={{ maxWidth: 520 }}>
      <ReviewCard
        author="Alex"
        rating={4.5}
        date="March 2026"
        verified
        body="Excellent road trip car. Plenty of room for all our luggage."
        photos={photos}
      />
    </div>
  );
}
