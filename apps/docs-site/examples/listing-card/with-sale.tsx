import { ListingCard } from '@ship-it-ui/ui';

const photos = [
  'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="oklch(0.7 0.18 130)"/></svg>',
    ),
];

export default function Example() {
  return (
    <ListingCard
      photos={photos}
      eyebrow="Convertible · 25% off"
      title="2021 BMW Z4"
      rating={4.8}
      reviewCount={94}
      originalPrice="$120"
      price="$89"
      priceUnit="/day"
      host="Priya"
      verified
    />
  );
}
