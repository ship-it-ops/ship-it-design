'use client';
import { useState } from 'react';
import { ListingCard } from '@ship-it-ui/ui';

const photos = [
  'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="oklch(0.65 0.18 230)"/><text x="200" y="135" font-family="sans-serif" font-size="22" text-anchor="middle" fill="#0a0a0b">Front</text></svg>',
    ),
  'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="oklch(0.65 0.18 30)"/><text x="200" y="135" font-family="sans-serif" font-size="22" text-anchor="middle" fill="#0a0a0b">Side</text></svg>',
    ),
];

function Inner() {
  const [fav, setFav] = useState(false);
  return (
    <ListingCard
      photos={photos}
      eyebrow="Mid-size SUV"
      title="2023 Tesla Model Y"
      rating={4.92}
      reviewCount={238}
      price="$89"
      priceUnit="/day"
      host="Jamie"
      distance="0.4 mi away"
      verified
      favorited={fav}
      onFavorite={setFav}
      href="#"
    />
  );
}

export default function Example() {
  return <Inner />;
}
